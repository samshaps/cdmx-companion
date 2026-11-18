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
  assert.deepEqual(suggestLocale('Mexico City'), { currency: 'MXN', language: 'es-MX', emoji: '🇲🇽' })
  assert.equal(suggestLocale('Kyoto').currency, 'JPY')
  assert.equal(suggestLocale('Atlantis'), null)
})
