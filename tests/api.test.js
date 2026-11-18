import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { beforeEach, test } from 'node:test'
import { handleManifest, handleTrips } from '../server/trips.js'

// Each test gets its own empty file-backed store.
let env
beforeEach(() => {
  env = { LOCAL_STORE_PATH: path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'trips-')), 'store.json') }
})

const basics = { name: 'Lisbon Crew', destination: 'Lisbon', start: '2027-03-01', end: '2027-03-03', homeCurrency: 'USD', localCurrency: 'EUR', languageCode: 'pt-PT' }

async function call(method, { id, token, passcode, body, ip } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (passcode) headers['X-Trip-Passcode'] = passcode
  if (ip) headers['X-Forwarded-For'] = ip
  const url = `http://test/api/trips${id ? `?id=${id}` : ''}`
  const res = await handleTrips(new Request(url, { method, headers, body: body ? JSON.stringify(body) : undefined }), env)
  return { status: res.status, body: await res.json() }
}

test('create returns an id, an edit token and a blank trip', async () => {
  const { status, body } = await call('POST', { body: basics })
  assert.equal(status, 201)
  assert.match(body.id, /^lisbon-crew-[\w-]{8}$/)
  assert.ok(body.editToken.length >= 30)
  assert.equal(body.doc.itinerary.length, 3)
})

test('secrets are stored only as hashes', async () => {
  const { body } = await call('POST', { body: { ...basics, passcode: 'sardine' } })
  const stored = fs.readFileSync(env.LOCAL_STORE_PATH, 'utf8')
  assert.ok(!stored.includes(body.editToken))
  assert.ok(!stored.includes('sardine'))
})

test('guests can read; only the edit token can write', async () => {
  const { body: created } = await call('POST', { body: basics })
  const { id, editToken, doc } = created

  const guest = await call('GET', { id })
  assert.equal(guest.status, 200)
  assert.equal(guest.body.canEdit, undefined)

  doc.trip.stay.wifi = { network: 'AlfamaGuest', password: 'pastel' }
  assert.equal((await call('PUT', { id, body: { doc } })).status, 401)
  assert.equal((await call('PUT', { id, token: 'wrong', body: { doc } })).status, 403)
  assert.equal((await call('GET', { id })).body.doc.trip.stay.wifi.network, '')

  assert.equal((await call('PUT', { id, token: editToken, body: { doc } })).status, 200)
  assert.equal((await call('GET', { id })).body.doc.trip.stay.wifi.network, 'AlfamaGuest')
})

test('a passcode hides the trip until it is supplied', async () => {
  const { body: created } = await call('POST', { body: { ...basics, passcode: 'Sardine' } })
  const { id, editToken, doc } = created

  const locked = await call('GET', { id })
  assert.equal(locked.status, 401)
  assert.deepEqual(Object.keys(locked.body).sort(), ['error', 'trip'])
  assert.deepEqual(locked.body.trip, { name: 'Lisbon Crew', emoji: '' })

  assert.equal((await call('GET', { id, passcode: 'anchovy' })).status, 401)
  assert.equal((await call('GET', { id, passcode: ' sardine ' })).status, 200) // forgiving of case and spaces
  assert.equal((await call('GET', { id, token: editToken })).body.hasPasscode, true)

  // The organiser can remove it again.
  assert.equal((await call('PUT', { id, token: editToken, body: { doc, passcode: '' } })).body.hasPasscode, false)
  assert.equal((await call('GET', { id })).status, 200)
})

test('passcode guessing is rate limited', async () => {
  const { body } = await call('POST', { body: { ...basics, passcode: 'sardine' } })
  let last
  for (let i = 0; i < 21; i++) last = await call('GET', { id: body.id, passcode: `guess-${i}`, ip: '203.0.113.9' })
  assert.equal(last.status, 429)
  // …and the right passcode is refused too until the window passes.
  assert.equal((await call('GET', { id: body.id, passcode: 'sardine', ip: '203.0.113.9' })).status, 429)
  assert.equal((await call('GET', { id: body.id, passcode: 'sardine', ip: '203.0.113.10' })).status, 200)
})

test('trip creation is rate limited per address', async () => {
  let last
  for (let i = 0; i < 11; i++) last = await call('POST', { body: basics, ip: '203.0.113.5' })
  assert.equal(last.status, 429)
  assert.equal((await call('POST', { body: basics, ip: '203.0.113.6' })).status, 201)
})

test('bad input and unknown trips get clear answers', async () => {
  assert.equal((await call('POST', { body: { ...basics, name: '' } })).body.error, 'Give the trip a name')
  assert.equal((await call('GET', { id: 'nope' })).status, 404)
  assert.equal((await call('DELETE', { id: 'nope' })).status, 405)
})

test('a deployment with no database says so', async () => {
  env = { VERCEL: '1' }
  const { status, body } = await call('POST', { body: basics })
  assert.equal(status, 503)
  assert.equal(body.error, 'storage_not_configured')
})

test('manifests install the trip; only a real edit key is embedded', async () => {
  const { body } = await call('POST', { body: basics })
  const manifest = async (query) =>
    (await handleManifest(new Request(`http://test/api/manifest?${query}`), env)).json()

  assert.equal((await manifest(`id=${body.id}`)).start_url, `/t/${body.id}`)
  assert.equal((await manifest(`id=${body.id}`)).name, 'Lisbon Crew')
  assert.equal((await manifest(`id=${body.id}&k=forged`)).start_url, `/t/${body.id}`)
  assert.equal((await manifest(`id=${body.id}&k=${body.editToken}`)).start_url, `/t/${body.id}?k=${body.editToken}`)
  assert.equal((await manifest('id=missing')).start_url, '/')
})
