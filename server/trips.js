// The whole backend: create, read and update trip documents.
//
//   POST /api/trips          create a trip        → { id, editToken, doc }
//   GET  /api/trips?id=…     read (guest or editor)
//   PUT  /api/trips?id=…     save (editor only)
//
// There are no accounts. Creating a trip returns a secret edit token; whoever
// holds it can edit. Guests read with the trip id alone, plus the trip's
// passcode if the organiser set one. Only hashes of secrets are stored.
import crypto from 'node:crypto'
import { createBlankTrip, normalizeTrip, TripValidationError } from '../shared/tripSchema.js'
import { getStore, StoreNotConfiguredError } from './store.js'

const DAY = 24 * 60 * 60
const KEEP_AFTER_TRIP_DAYS = 30
const CREATES_PER_HOUR = 10
const PASSCODE_TRIES_PER_10_MIN = 20

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')
const sameHash = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
const randomId = (bytes) => crypto.randomBytes(bytes).toString('base64url')
const passcodeHash = (id, passcode) => sha256(`${id}:${passcode.trim().toLowerCase()}`)

function slugify(name) {
  return name.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().toLowerCase().replace(/[\s_]+/g, '-').slice(0, 30) || 'trip'
}

// Trips delete themselves a month after they end, so the store stays small
// and nobody's door code lingers forever.
function ttlSeconds(doc, now = Date.now()) {
  const expires = Date.parse(doc.trip.dates.end + 'T23:59:59Z') + KEEP_AFTER_TRIP_DAYS * DAY * 1000
  return Math.max(7 * DAY, Math.round((expires - now) / 1000))
}

function clientIp(request) {
  return (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
}

function bearerToken(request) {
  const match = /^Bearer (.+)$/.exec(request.headers.get('authorization') || '')
  return match ? match[1] : null
}

async function readBody(request) {
  const raw = await request.text()
  if (raw.length > 400_000) throw new TripValidationError('Request is too large')
  try { return JSON.parse(raw) } catch { throw new TripValidationError('Request was not valid JSON') }
}

async function createTrip(request, store) {
  const hour = Math.floor(Date.now() / (3600 * 1000))
  const count = await store.increment(`rl:create:${clientIp(request)}:${hour}`, 3600)
  if (count > CREATES_PER_HOUR) return json(429, { error: 'Too many trips created from here. Try again in an hour.' })

  const body = await readBody(request)
  // `doc` lets a client create from a full document (e.g. an import);
  // otherwise the basics from the create form become a blank trip.
  const doc = body.doc ? normalizeTrip(body.doc) : createBlankTrip(body)
  const id = `${slugify(doc.trip.name)}-${randomId(6)}`
  const editToken = randomId(24)
  const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : ''
  const now = new Date().toISOString()
  await store.set(`trip:${id}`, {
    doc,
    editHash: sha256(editToken),
    passcodeHash: passcode ? passcodeHash(id, passcode) : null,
    createdAt: now,
    updatedAt: now,
  }, ttlSeconds(doc))
  return json(201, { id, editToken, doc, hasPasscode: Boolean(passcode) })
}

async function readTrip(request, store, id) {
  const record = await store.get(`trip:${id}`)
  if (!record) return json(404, { error: 'not_found' })

  const token = bearerToken(request)
  if (token) {
    if (!sameHash(sha256(token), record.editHash)) return json(403, { error: 'wrong_edit_link' })
    return json(200, { doc: record.doc, updatedAt: record.updatedAt, canEdit: true, hasPasscode: Boolean(record.passcodeHash) })
  }

  if (record.passcodeHash) {
    const passcode = request.headers.get('x-trip-passcode')
    const locked = { error: 'passcode_required', trip: { name: record.doc.trip.name, emoji: record.doc.trip.emoji } }
    if (!passcode) return json(401, locked)
    const window = Math.floor(Date.now() / (600 * 1000))
    const tries = await store.increment(`rl:pass:${id}:${clientIp(request)}:${window}`, 600)
    if (tries > PASSCODE_TRIES_PER_10_MIN) return json(429, { error: 'Too many attempts. Try again in a few minutes.' })
    if (!sameHash(passcodeHash(id, passcode), record.passcodeHash)) return json(401, { ...locked, wrong: true })
  }
  return json(200, { doc: record.doc, updatedAt: record.updatedAt })
}

async function saveTrip(request, store, id) {
  const token = bearerToken(request)
  if (!token) return json(401, { error: 'edit_link_required' })
  const record = await store.get(`trip:${id}`)
  if (!record) return json(404, { error: 'not_found' })
  if (!sameHash(sha256(token), record.editHash)) return json(403, { error: 'wrong_edit_link' })

  const body = await readBody(request)
  const doc = normalizeTrip(body.doc)
  // passcode: omitted = keep, "" = remove, anything else = replace.
  let hash = record.passcodeHash
  if (typeof body.passcode === 'string') hash = body.passcode.trim() ? passcodeHash(id, body.passcode) : null
  const updated = { ...record, doc, passcodeHash: hash, updatedAt: new Date().toISOString() }
  await store.set(`trip:${id}`, updated, ttlSeconds(doc))
  return json(200, { doc, updatedAt: updated.updatedAt, canEdit: true, hasPasscode: Boolean(hash) })
}

export async function handleTrips(request, env = process.env) {
  try {
    const store = getStore(env)
    const id = new URL(request.url).searchParams.get('id')
    if (request.method === 'POST' && !id) return await createTrip(request, store)
    if (request.method === 'GET' && id) return await readTrip(request, store, id)
    if (request.method === 'PUT' && id) return await saveTrip(request, store, id)
    return json(405, { error: 'method_not_allowed' })
  } catch (error) {
    if (error instanceof TripValidationError) return json(400, { error: error.message })
    if (error instanceof StoreNotConfiguredError) return json(503, { error: 'storage_not_configured' })
    console.error(error)
    return json(500, { error: 'Something went wrong' })
  }
}

// Each trip gets its own web app manifest so "Add to Home Screen" installs
// that trip (its name, its link) rather than the generic landing page.
export async function handleManifest(request, env = process.env) {
  const params = new URL(request.url).searchParams
  const id = params.get('id') || ''
  const key = params.get('k') || ''
  let name = 'Trip Companion'
  let startUrl = '/'
  let isOrganiser = false
  try {
    const record = id ? await getStore(env).get(`trip:${id}`) : null
    if (record) {
      name = record.doc.trip.name
      startUrl = `/t/${encodeURIComponent(id)}`
      // An organiser's installed app starts with their edit key, since an
      // installed app on iPhone does not share the browser's storage.
      if (key && sameHash(sha256(key), record.editHash)) {
        isOrganiser = true
        startUrl += `?k=${encodeURIComponent(key)}`
      }
    }
  } catch { /* fall back to the generic manifest */ }
  const manifest = {
    name,
    short_name: name.slice(0, 12),
    start_url: startUrl,
    scope: '/',
    display: 'standalone',
    theme_color: '#1A535C',
    background_color: '#FFF5E6',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': isOrganiser ? 'private, no-store' : 'public, max-age=300',
    },
  })
}
