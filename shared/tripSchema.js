// The trip document: its shape, limits and defaults. Shared by the browser
// (forms) and the server (validation), so both agree on what a trip is.
import { starterPhrases } from './phrasePacks.js'
import { normalizeSkin } from './skins.js'

export { searchDestinations, suggestLocale } from './destinations.js'

export const LIMITS = {
  docBytes: 200_000,
  tripDays: 31,
  eventsPerDay: 30,
  places: 200,
  phrases: 200,
  manualSections: 12,
}

export const EVENT_CATEGORIES = ['activity', 'meal', 'transit', 'free']
export const PLACE_CATEGORIES = ['eat', 'drink', 'see', 'shop']

// The parts of a day the schedule editor offers as ready-made blanks. An
// event remembers which one it fills; `time` and `category` are its defaults.
export const DAY_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🍳', time: '08:30', category: 'meal' },
  { key: 'morning', label: 'Morning', emoji: '🌤️', time: '10:00', category: 'activity' },
  { key: 'lunch', label: 'Lunch', emoji: '🥗', time: '13:00', category: 'meal' },
  { key: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '15:00', category: 'activity' },
  { key: 'dinner', label: 'Dinner', emoji: '🍽️', time: '19:30', category: 'meal' },
  { key: 'evening', label: 'Evening', emoji: '🌙', time: '21:30', category: 'activity' },
]
const SLOT_KEYS = DAY_SLOTS.map((slot) => slot.key)

// The three most common first, then alphabetical.
export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'AED', 'ARS', 'AUD', 'AWG', 'BBD', 'BGN', 'BMD', 'BOB',
  'BRL', 'BSD', 'BZD', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CZK',
  'DKK', 'DOP', 'EGP', 'FJD', 'GEL', 'GTQ', 'HKD', 'HTG', 'HUF', 'IDR', 'ILS',
  'INR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KHR', 'KRW', 'KYD', 'LKR', 'MAD',
  'MUR', 'MVR', 'MXN', 'MYR', 'NOK', 'NPR', 'NZD', 'PAB', 'PEN', 'PHP', 'PLN',
  'QAR', 'RON', 'SAR', 'SCR', 'SEK', 'SGD', 'THB', 'TRY', 'TTD', 'TWD', 'TZS',
  'UYU', 'VND', 'XCD', 'XCG', 'XPF', 'ZAR',
]

export const LANGUAGES = [
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'de-DE', name: 'German' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'el-GR', name: 'Greek' },
  { code: 'tr-TR', name: 'Turkish' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'th-TH', name: 'Thai' },
  { code: 'vi-VN', name: 'Vietnamese' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'he-IL', name: 'Hebrew' },
  { code: 'sv-SE', name: 'Swedish' },
  { code: 'nb-NO', name: 'Norwegian' },
  { code: 'da-DK', name: 'Danish' },
  { code: 'fi-FI', name: 'Finnish' },
  { code: 'is-IS', name: 'Icelandic' },
  { code: 'cs-CZ', name: 'Czech' },
  { code: 'pl-PL', name: 'Polish' },
  { code: 'hu-HU', name: 'Hungarian' },
  { code: 'hr-HR', name: 'Croatian' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'en-US', name: 'English (US)' },
]

export class TripValidationError extends Error {}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

function text(value, max) {
  return (typeof value === 'string' ? value : '').trim().slice(0, max)
}

function coordinate(value, bound) {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= bound ? n : null
}

function list(value, max, what) {
  if (value == null) return []
  if (!Array.isArray(value)) throw new TripValidationError(`${what} must be a list`)
  if (value.length > max) throw new TripValidationError(`Too many ${what} (max ${max})`)
  return value
}

function oneOf(value, allowed) {
  return allowed.includes(value) ? value : allowed[0]
}

function isoDate(value, what) {
  if (typeof value !== 'string' || !ISO_DATE.test(value) || Number.isNaN(Date.parse(value))) {
    throw new TripValidationError(`${what} must be a date`)
  }
  return value
}

function photoUrl(value) {
  const url = text(value, 500)
  return /^https:\/\//.test(url) || url.startsWith('/images/') ? url : ''
}

export function datesBetween(start, end) {
  const days = []
  const cursor = new Date(start + 'T12:00:00Z')
  const last = new Date(end + 'T12:00:00Z')
  while (cursor <= last) {
    days.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return days
}

// Returns a clean copy of `input` containing only known fields, or throws
// TripValidationError. Everything a guest's browser renders passes through here.
export function normalizeTrip(input) {
  if (!input || typeof input !== 'object') throw new TripValidationError('Trip is missing')
  const t = input.trip || {}
  const stay = t.stay || {}

  const name = text(t.name, 60)
  if (!name) throw new TripValidationError('Give the trip a name')
  const start = isoDate(t.dates?.start, 'Start date')
  const end = isoDate(t.dates?.end, 'End date')
  if (end < start) throw new TripValidationError('The trip ends before it starts')
  if (datesBetween(start, end).length > LIMITS.tripDays) {
    throw new TripValidationError(`Trips can be at most ${LIMITS.tripDays} days`)
  }

  const currencyCode = (v, fallback) => (/^[A-Z]{3}$/.test(v) ? v : fallback)
  const langCode = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(t.language?.code) ? t.language.code : 'en-GB'

  const doc = {
    trip: {
      name,
      emoji: text(t.emoji, 8),
      destination: text(t.destination, 80),
      dates: { start, end },
      currency: {
        home: currencyCode(t.currency?.home, 'USD'),
        local: currencyCode(t.currency?.local, 'USD'),
      },
      language: { code: langCode, name: text(t.language?.name, 40) },
      // Flag-colour skin, or null for the original colours.
      skin: normalizeSkin(t.skin),
      stay: {
        name: text(stay.name, 100),
        address: text(stay.address, 200),
        navigationAddress: text(stay.navigationAddress, 200),
        lat: coordinate(stay.lat, 90),
        lng: coordinate(stay.lng, 180),
        photo: photoUrl(stay.photo),
        wifi: { network: text(stay.wifi?.network, 100), password: text(stay.wifi?.password, 100) },
        checkIn: text(stay.checkIn, 20),
        checkOut: text(stay.checkOut, 20),
        manual: list(stay.manual, LIMITS.manualSections, 'house manual sections')
          .map((s) => ({ title: text(s?.title, 60), body: text(s?.body, 2000) }))
          .filter((s) => s.title || s.body),
      },
    },
    itinerary: list(input.itinerary, LIMITS.tripDays, 'days').map((day) => ({
      date: isoDate(day?.date, 'Day date'),
      dayTitle: text(day?.dayTitle, 60),
      events: list(day?.events, LIMITS.eventsPerDay, 'events in a day')
        .map((e) => ({
          time: TIME.test(e?.time) ? e.time : '12:00',
          name: text(e?.name, 100),
          category: oneOf(e?.category, EVENT_CATEGORIES),
          slot: SLOT_KEYS.includes(e?.slot) ? e.slot : '',
          address: text(e?.address, 200),
          notes: text(e?.notes, 500),
          personalNote: text(e?.personalNote, 300),
        }))
        .filter((e) => e.name)
        .sort((a, b) => a.time.localeCompare(b.time)),
    })),
    places: list(input.places, LIMITS.places, 'places')
      .map((p) => ({
        name: text(p?.name, 100),
        category: oneOf(p?.category, PLACE_CATEGORIES),
        lat: coordinate(p?.lat, 90),
        lng: coordinate(p?.lng, 180),
        address: text(p?.address, 200),
        note: text(p?.note, 300),
      }))
      .filter((p) => p.name),
    phrases: list(input.phrases, LIMITS.phrases, 'phrases')
      .map((p) => ({
        category: text(p?.category, 30).toLowerCase() || 'basics',
        english: text(p?.english, 200),
        translation: text(p?.translation, 200),
        phonetic: text(p?.phonetic, 200),
      }))
      .filter((p) => p.english && p.translation),
  }

  if (JSON.stringify(doc).length > LIMITS.docBytes) {
    throw new TripValidationError('This trip has grown too large to save')
  }
  return doc
}

const defaultDayTitle = (i, count) => (i === 0 ? 'Arrival' : i === count - 1 ? 'Departure' : `Day ${i + 1}`)

// Fits the itinerary to a (possibly changed) date range: days already
// planned are kept, new dates get an empty day, dates outside the range go.
export function reconcileItinerary(itinerary, start, end) {
  const dates = datesBetween(start, end).slice(0, LIMITS.tripDays)
  return dates.map((date, i) =>
    itinerary.find((day) => day.date === date) || { date, dayTitle: defaultDayTitle(i, dates.length), events: [] })
}

// A new trip: the basics from the create form, one empty day per date, and
// a starter phrase book when we have one for the language.
export function createBlankTrip({ name, emoji, destination, start, end, homeCurrency, localCurrency, languageCode, skin }) {
  const language = LANGUAGES.find((l) => l.code === languageCode) || { code: languageCode, name: '' }
  const dates = ISO_DATE.test(start || '') && ISO_DATE.test(end || '') && end >= start ? datesBetween(start, end) : []
  return normalizeTrip({
    trip: {
      name,
      emoji,
      destination,
      dates: { start, end },
      currency: { home: homeCurrency, local: localCurrency },
      language,
      skin,
      stay: {},
    },
    itinerary: dates.length ? reconcileItinerary([], start, end) : [],
    places: [],
    phrases: starterPhrases(language.code),
  })
}
