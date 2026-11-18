import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseCoordinates } from '../src/utils/coordinates.js'

test('reads coordinates from the things people paste', () => {
  const pin = { lat: 38.7118, lng: -9.1296 }
  assert.deepEqual(parseCoordinates('38.7118, -9.1296'), pin)
  assert.deepEqual(parseCoordinates('https://www.google.com/maps/@38.7118,-9.1296,17z'), pin)
  assert.deepEqual(parseCoordinates('https://maps.google.com/?q=38.7118,-9.1296'), pin)
  assert.deepEqual(parseCoordinates('https://maps.apple.com/?ll=38.7118,-9.1296'), pin)
})

test('prefers the place pin over the map viewport', () => {
  const url = 'https://www.google.com/maps/place/X/@38.7000,-9.1000,17z/data=!3d38.7118!4d-9.1296'
  assert.deepEqual(parseCoordinates(url), { lat: 38.7118, lng: -9.1296 })
})

test('gives up on text with no usable coordinates', () => {
  assert.equal(parseCoordinates('https://maps.app.goo.gl/abc123'), null)
  assert.equal(parseCoordinates('Rua Exemplo 12'), null)
  assert.equal(parseCoordinates('138.7, -9.1'), null)
  assert.equal(parseCoordinates(''), null)
})
