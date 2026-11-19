// "Paste a link to your Airbnb, Vrbo or hotel": fetches that page and pulls
// out what it publishes about the place (name, photo, sometimes the address
// and check-in times) so the organizer does not have to retype it.
//
//   POST /api/preview?id=<trip>   { url }   (organizers only)
//
// Fetching a URL a user supplies is the classic way to get a server to poke
// at things it should not, so the target must be a public https address,
// redirects are followed by hand and re-checked, and size and time are capped.
import dns from 'node:dns/promises'
import net from 'node:net'
import { getStore, StoreNotConfiguredError } from './store.js'
import { bearerToken, clientIp, isOrganizer, json } from './trips.js'

const MAX_BYTES = 2_000_000
const TIMEOUT_MS = 8000
const MAX_REDIRECTS = 4
const PREVIEWS_PER_HOUR = 30
const USER_AGENT = 'TripCompanion/1.0 (link preview for a trip organizer)'

export class PreviewError extends Error {}

export function isPublicAddress(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return !(
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19))
    )
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase()
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower)
    if (mapped) return isPublicAddress(mapped[1])
    return !(lower === '::' || lower === '::1' || /^f[cd]/.test(lower) || /^fe[89ab]/.test(lower) || lower.startsWith('ff'))
  }
  return false
}

export async function assertPublicUrl(urlString, lookup = dns.lookup) {
  let url
  try { url = new URL(urlString) } catch { throw new PreviewError('That does not look like a web address.') }
  if (url.protocol !== 'https:') throw new PreviewError('The link needs to start with https://')
  if (url.username || url.password || (url.port && url.port !== '443')) throw new PreviewError('That link cannot be read.')
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (net.isIP(host) || !host.includes('.')) throw new PreviewError('That link cannot be read.')
  let addresses
  try { addresses = await lookup(host, { all: true }) } catch { throw new PreviewError('That site could not be found.') }
  if (!addresses.length || !addresses.every((a) => isPublicAddress(a.address))) throw new PreviewError('That link cannot be read.')
  return url
}

// Search and browse pages describe many places (or none), so anything read
// from them would be a guess. Ask for the listing's own page instead.
const NOT_A_LISTING = [
  [/(^|\.)airbnb\.[a-z.]+$/, /^\/(rooms|h|luxury\/listing)\//, 'That is an Airbnb search page. Open the listing itself and paste that link (it has /rooms/ in it).'],
  [/(^|\.)vrbo\.com$/, /^\/(\d|[a-z-]+\/p\d)/, 'That is a Vrbo search page. Open the listing itself and paste that link.'],
  [/(^|\.)booking\.com$/, /^\/hotel\//, 'That is a Booking.com search page. Open the hotel’s own page and paste that link.'],
]

export function assertListingUrl(url) {
  for (const [host, listingPath, message] of NOT_A_LISTING) {
    if (host.test(url.hostname) && !listingPath.test(url.pathname)) throw new PreviewError(message)
  }
}

async function fetchPage(urlString) {
  let url = await assertPublicUrl(urlString)
  assertListingUrl(url)
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en' },
    })
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = await assertPublicUrl(new URL(res.headers.get('location'), url).toString())
      continue
    }
    if (!res.ok) throw new PreviewError('That site would not share the page with us.')
    if (!/html/i.test(res.headers.get('content-type') || '')) throw new PreviewError('That link is not a web page.')
    // Read at most MAX_BYTES; listing pages can be enormous.
    const reader = res.body.getReader()
    const chunks = []
    let size = 0
    while (size < MAX_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      size += value.length
    }
    reader.cancel().catch(() => {})
    return new TextDecoder().decode(Buffer.concat(chunks))
  }
  throw new PreviewError('That link redirects too many times.')
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] !== '#') return ENTITIES[code.toLowerCase()] ?? whole
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
    return Number.isFinite(point) && point > 0 && point < 0x110000 ? String.fromCodePoint(point) : whole
  })
}

function metaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const key = /\b(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)
    if (!key || key[1].toLowerCase() !== name) continue
    const content = /\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i.exec(tag)
    if (content) return decodeEntities(content[1] ?? content[2]).trim()
  }
  return ''
}

const LODGING_TYPES = /^(Hotel|Motel|Hostel|Resort|BedAndBreakfast|LodgingBusiness|VacationRental|Apartment|House|Accommodation|SingleFamilyResidence|Campground)$/

// Structured data ("JSON-LD") is how listing sites describe a place to
// search engines. Returns every block that describes somewhere to stay.
function lodgingNodes(html) {
  const nodes = []
  for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1])
      for (const item of Array.isArray(data) ? data : [data]) nodes.push(item, ...(Array.isArray(item?.['@graph']) ? item['@graph'] : []))
    } catch { /* malformed block: skip it */ }
  }
  const typesOf = (node) => [].concat(node?.['@type'] || [])
  return nodes.filter((node) => typesOf(node).some((type) => LODGING_TYPES.test(type)))
}

function clock(value) {
  const match = /(\d{1,2}):(\d{2})/.exec(typeof value === 'string' ? value : '')
  if (!match) return ''
  const hours = Number(match[1])
  if (hours > 23) return ''
  return `${hours % 12 || 12}:${match[2]} ${hours >= 12 ? 'PM' : 'AM'}`
}

const text = (value, max) => (typeof value === 'string' ? decodeEntities(value).replace(/\s+/g, ' ').trim().slice(0, max) : '')

function firstImage(image) {
  const candidate = Array.isArray(image) ? image[0] : image
  const url = typeof candidate === 'string' ? candidate : candidate?.url
  return typeof url === 'string' && url.startsWith('https://') ? url.slice(0, 500) : ''
}

export function extractStay(html) {
  const places = lodgingNodes(html)
  // Several different places on one page means a list, not a listing.
  if (new Set(places.map((p) => p.name).filter(Boolean)).size > 1) {
    throw new PreviewError('That page lists several places. Open the one you booked and paste that link.')
  }
  const data = places[0] || {}
  const address = data.address && typeof data.address === 'object' ? data.address : {}
  const street = text(address.streetAddress, 120)
  const country = typeof address.addressCountry === 'object' ? address.addressCountry?.name : address.addressCountry

  // A street address means the site is telling us exactly where the place
  // is. Without one (Airbnb and Vrbo before booking) any coordinates are
  // deliberately approximate, so they are not used as the map pin.
  const precise = Boolean(street)
  const lat = Number(data.geo?.latitude ?? data.latitude)
  const lng = Number(data.geo?.longitude ?? data.longitude)
  const hasPin = precise && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180

  const ogTitle = metaContent(html, 'og:title').split(/\s[·|–—-]\s/)[0]
  const ogImage = metaContent(html, 'og:image')

  return {
    name: text(data.name, 100) || text(ogTitle, 100),
    photo: firstImage(data.image) || (ogImage.startsWith('https://') ? ogImage.slice(0, 500) : ''),
    address: precise
      ? [street, text(address.addressLocality, 60), text(address.addressRegion, 60), text(address.postalCode, 20), text(country, 60)].filter(Boolean).join(', ')
      : '',
    area: precise ? '' : text(address.addressLocality, 60),
    lat: hasPin ? lat : null,
    lng: hasPin ? lng : null,
    checkIn: clock(data.checkinTime),
    checkOut: clock(data.checkoutTime),
  }
}

export async function handlePreview(request, env = process.env, fetcher = fetchPage) {
  try {
    if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' })
    const store = getStore(env)
    const id = new URL(request.url).searchParams.get('id')
    if (!(await isOrganizer(store, id, bearerToken(request)))) return json(403, { error: 'wrong_edit_link' })

    const hour = Math.floor(Date.now() / (3600 * 1000))
    const count = await store.increment(`rl:preview:${clientIp(request)}:${hour}`, 3600)
    if (count > PREVIEWS_PER_HOUR) return json(429, { error: 'Too many links looked up. Try again in an hour.' })

    const { url } = await request.json().catch(() => ({}))
    if (typeof url !== 'string' || url.length > 2000) return json(400, { error: 'Paste a link to the listing.' })
    const stay = extractStay(await fetcher(url.trim()))
    if (!stay.name && !stay.photo) return json(422, { error: 'We could not find any details on that page.' })
    return json(200, { stay })
  } catch (error) {
    if (error instanceof PreviewError) return json(422, { error: error.message })
    if (error instanceof StoreNotConfiguredError) return json(503, { error: 'storage_not_configured' })
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') return json(422, { error: 'That site took too long to answer.' })
    console.error(error)
    return json(422, { error: 'We could not read that page.' })
  }
}
