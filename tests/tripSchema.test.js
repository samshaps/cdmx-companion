import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  createBlankTrip, normalizeTrip, reconcileItinerary, suggestLocale, TripValidationError,
} from '../shared/tripSchema.js'

const basics = { name: 'Lisbon Crew', destination: 'Lisbon', start: '2027-03-01', end: '2027-03-03', homeCurrency: 'USD', localCurrency: 'EUR', languageCode: 'pt-PT' }

test('a blank trip has one empty day per date', () => {
  const doc = createBlankTrip(basics)
  assert.deepEqual(doc.itinerary.map((d) => d.date), ['2027-03-01', '2027-03-02', '2027-03-03'])
  assert.deepEqual(doc.itinerary.map((d) => d.dayTitle), ['Arrival', 'Day 2', 'Departure'])
  assert.equal(doc.trip.language.name, 'Portuguese (Portugal)')
})

test('a trip needs a name and sensible dates', () => {
  assert.throws(() => createBlankTrip({ ...basics, name: '  ' }), TripValidationError)
  assert.throws(() => createBlankTrip({ ...basics, end: '2027-02-01' }), /ends before/)
  assert.throws(() => createBlankTrip({ ...basics, end: '2027-06-01' }), /at most 31 days/)
  assert.throws(() => createBlankTrip({ ...basics, start: 'tomorrow' }), /must be a date/)
})

test('normalizing drops unknown fields, empty rows and unsafe photo links', () => {
  const doc = createBlankTrip(basics)
  doc.trip.isAdmin = true
  doc.trip.stay.photo = 'javascript:alert(1)'
  doc.places = [{ name: '' }, { name: 'Bar', category: 'nonsense', lat: '38.7', lng: 999 }]
  doc.phrases = [{ english: 'Hi' }, { english: 'Hi', translation: 'Olá', category: ' Basics ' }]
  const clean = normalizeTrip(doc)
  assert.equal(clean.trip.isAdmin, undefined)
  assert.equal(clean.trip.stay.photo, '')
  assert.deepEqual(clean.places, [{ name: 'Bar', category: 'eat', lat: 38.7, lng: null, address: '', note: '' }])
  assert.deepEqual(clean.phrases, [{ category: 'basics', english: 'Hi', translation: 'Olá', phonetic: '' }])
})

test('events are kept in time order and need a name', () => {
  const doc = createBlankTrip(basics)
  doc.itinerary[0].events = [
    { time: '19:00', name: 'Dinner' },
    { time: '09:00', name: 'Coffee' },
    { time: '10:00', name: '' },
    { time: 'late', name: 'Drinks' },
  ]
  const events = normalizeTrip(doc).itinerary[0].events
  assert.deepEqual(events.map((e) => `${e.time} ${e.name}`), ['09:00 Coffee', '12:00 Drinks', '19:00 Dinner'])
})

test('over-long lists and oversized trips are refused', () => {
  const doc = createBlankTrip(basics)
  doc.places = Array.from({ length: 201 }, (_, i) => ({ name: `Place ${i}` }))
  assert.throws(() => normalizeTrip(doc), /Too many places/)
})

test('changing dates keeps planned days and adds empty ones', () => {
  const doc = createBlankTrip(basics)
  doc.itinerary[1].events = [{ time: '20:00', name: 'Dinner' }]
  const next = reconcileItinerary(doc.itinerary, '2027-03-02', '2027-03-04')
  assert.deepEqual(next.map((d) => d.date), ['2027-03-02', '2027-03-03', '2027-03-04'])
  assert.equal(next[0].events[0].name, 'Dinner')
  assert.deepEqual(next[2].events, [])
})

test('destinations suggest a currency and language', () => {
  const mexico = suggestLocale('Mexico City')
  assert.deepEqual([mexico.emoji, mexico.currency, mexico.language, mexico.hello], ['🇲🇽', 'MXN', 'es-MX', '¡Hola!'])
  assert.equal(suggestLocale('São Paulo').language, 'pt-BR')
  assert.equal(suggestLocale('Lagos, Portugal').currency, 'EUR')
  assert.equal(suggestLocale('a week in new york').emoji, '🇺🇸')
  assert.equal(suggestLocale('Bukhara'), null)
  assert.equal(suggestLocale('Kyoto').currency, 'JPY')
  assert.equal(suggestLocale('Atlantis'), null)
})

test('new trips start with a phrase book when the language has one', () => {
  const lisbon = createBlankTrip(basics)
  assert.equal(lisbon.phrases.length, 17)
  assert.equal(lisbon.phrases[1].translation, 'Obrigado / Obrigada')
  assert.equal(createBlankTrip({ ...basics, languageCode: 'pt-BR' }).phrases[11].translation, 'Onde fica o banheiro?')
  assert.deepEqual(createBlankTrip({ ...basics, languageCode: 'sv-SE' }).phrases, [])
})

test('every starter phrase book is complete', async () => {
  const { starterPhrases, STARTER_PHRASES } = await import('../shared/phrasePacks.js')
  for (const code of ['es', 'fr', 'it', 'pt', 'de', 'nl', 'el', 'tr', 'ja', 'ko', 'zh', 'th', 'vi', 'id', 'hi', 'ar', 'he']) {
    const pack = starterPhrases(code)
    assert.equal(pack.length, STARTER_PHRASES.length, code)
    assert.ok(pack.every((p) => p.translation && p.phonetic), code)
  }
})

test('events remember which part of the day they fill', () => {
  const doc = createBlankTrip(basics)
  doc.itinerary[0].events = [{ time: '19:30', name: 'Dinner', slot: 'dinner' }, { time: '09:00', name: 'Pickup', slot: 'brunch' }]
  assert.deepEqual(normalizeTrip(doc).itinerary[0].events.map((e) => e.slot), ['', 'dinner'])
})

test('US states are destinations with their own cities, colours and greetings', async () => {
  const { searchDestinations } = await import('../shared/destinations.js')
  assert.deepEqual(searchDestinations('tex').map((d) => d.label).slice(0, 2), ['Texas, USA', 'Austin, Texas'])
  assert.equal(suggestLocale('Maui').hello, 'Aloha!')
  assert.equal(suggestLocale('Maui').currency, 'USD')
  assert.equal(suggestLocale('Georgia').place, 'Georgia') // the state wins a tie with the country
  assert.equal(suggestLocale('Tbilisi').place, 'Georgia (country)')
  assert.equal(suggestLocale('Aruba').hello, 'Bon dia!')
})

test('every destination skin is readable', async () => {
  const { searchDestinations } = await import('../shared/destinations.js')
  const { contrast } = await import('../shared/skins.js')
  const seen = new Set()
  for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
    for (const place of searchDestinations(letter, 1000)) {
      seen.add(place.place)
      assert.ok(contrast(place.skin.primary, '#FFFFFF') >= 4.5, `${place.place} primary`)
      assert.ok(contrast(place.skin.accent, '#FFF5E6') >= 4, `${place.place} accent`)
      assert.ok(contrast(place.skin.highlight, '#FFF5E6') >= 1.7, `${place.place} highlight`)
      assert.ok(place.hello, `${place.place} hello`)
    }
  }
  assert.ok(seen.size >= 150, `only ${seen.size} places`)
})

test('skins are stored only as three real colours', () => {
  const doc = createBlankTrip({ ...basics, skin: suggestLocale('Lisbon').skin })
  assert.match(doc.trip.skin.primary, /^#[0-9A-F]{6}$/)
  assert.equal(createBlankTrip({ ...basics, skin: { primary: 'red', accent: '#000000', highlight: '#FFFFFF' } }).trip.skin, null)
  assert.equal(createBlankTrip(basics).trip.skin, null)
  // A skin that would be unreadable is darkened on the way in.
  const pale = createBlankTrip({ ...basics, skin: { primary: '#FFFF00', accent: '#FFFFFF', highlight: '#FFFFFF' } }).trip.skin
  assert.notEqual(pale.primary, '#FFFF00')
})

test('a trip remembers its interface language and is set up in it', () => {
  const doc = createBlankTrip({ ...basics, locale: 'fr-CA' })
  assert.equal(doc.trip.locale, 'fr')
  assert.equal(createBlankTrip(basics).trip.locale, 'en')
  assert.equal(createBlankTrip({ ...basics, locale: 'klingon' }).trip.locale, 'en')
  // The phrase book pairs the traveller's language with the destination's.
  assert.deepEqual([doc.phrases[1].english, doc.phrases[1].translation], ['Merci', 'Obrigado / Obrigada'])
  // …and there is nothing to learn when they are the same language.
  assert.deepEqual(createBlankTrip({ ...basics, languageCode: 'fr-FR', locale: 'fr' }).phrases, [])
})
