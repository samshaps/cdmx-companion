import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { assertListingUrl, assertPublicUrl, extractStay, handlePreview, isPublicAddress, PreviewError } from '../server/linkPreview.js'
import { handleTrips } from '../server/trips.js'

const page = (jsonLd, head = '') =>
  `<html><head>${head}<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head></html>`

test('a hotel page gives name, photo, full address, pin and times', () => {
  const stay = extractStay(page({
    '@type': 'Hotel',
    name: 'Hotel Exemplo &amp; Spa',
    image: ['https://img.example/1.jpg', 'https://img.example/2.jpg'],
    address: { streetAddress: 'Rua Exemplo 12', addressLocality: 'Lisbon', postalCode: '1100-001', addressCountry: { name: 'Portugal' } },
    geo: { latitude: '38.7118', longitude: -9.1296 },
    checkinTime: '15:00:00',
    checkoutTime: '11:00',
  }))
  assert.deepEqual(stay, {
    name: 'Hotel Exemplo & Spa',
    photo: 'https://img.example/1.jpg',
    address: 'Rua Exemplo 12, Lisbon, 1100-001, Portugal',
    area: '',
    lat: 38.7118,
    lng: -9.1296,
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
  })
})

test('a rental with no street address keeps its approximate location off the map', () => {
  const stay = extractStay(page({
    '@type': 'VacationRental',
    name: 'Rooftop Loft',
    image: 'https://img.example/loft.jpg',
    latitude: 19.41,
    longitude: -99.17,
    address: { addressLocality: 'Mexico City' },
  }))
  assert.equal(stay.name, 'Rooftop Loft')
  assert.equal(stay.address, '')
  assert.equal(stay.area, 'Mexico City')
  assert.equal(stay.lat, null)
  assert.equal(stay.lng, null)
})

test('falls back to the page’s share title and image', () => {
  const html = `<meta content="Casa Azul · ★4.9 · 2 bedrooms" property="og:title"><meta property='og:image' content='https://img.example/a.jpg?w=1&amp;h=2'>`
  assert.deepEqual(
    { name: extractStay(html).name, photo: extractStay(html).photo },
    { name: 'Casa Azul', photo: 'https://img.example/a.jpg?w=1&h=2' },
  )
  assert.equal(extractStay('<meta property="og:image" content="http://insecure.example/a.jpg">').photo, '')
  assert.equal(extractStay('<script type="application/ld+json">{not json</script>').name, '')
})

test('search pages are turned away with a pointer to the listing', () => {
  const search = 'https://www.airbnb.com/s/Big-Sky--MT/homes?checkin=2026-12-10'
  assert.throws(() => assertListingUrl(new URL(search)), /Open the listing itself/)
  assert.throws(() => assertListingUrl(new URL('https://www.booking.com/searchresults.html?ss=Lisbon')), PreviewError)
  assert.doesNotThrow(() => assertListingUrl(new URL('https://www.airbnb.com/rooms/20669368')))
  assert.doesNotThrow(() => assertListingUrl(new URL('https://www.airbnb.co.uk/rooms/20669368?adults=2')))
  assert.doesNotThrow(() => assertListingUrl(new URL('https://www.booking.com/hotel/pt/memmo-alfama.html')))
  assert.doesNotThrow(() => assertListingUrl(new URL('https://www.some-hotel.example/rooms')))
  // A page describing several different places is a list, whatever its address.
  const list = [{ '@type': 'Hotel', name: 'Deluxe King' }, { '@type': 'Hotel', name: 'Lodge Suite' }]
  assert.throws(() => extractStay(page(list)), /lists several places/)
})

test('only public https addresses may be fetched', async () => {
  const resolvesTo = (address) => async () => [{ address }]
  for (const url of ['http://example.com/', 'https://127.0.0.1/', 'https://localhost/', 'https://[::1]/', 'https://user:pw@example.com/', 'https://example.com:8443/', 'ftp://example.com/', 'nonsense']) {
    await assert.rejects(assertPublicUrl(url, resolvesTo('93.184.216.34')), PreviewError, url)
  }
  for (const ip of ['10.0.0.5', '127.0.0.1', '169.254.169.254', '172.16.0.1', '192.168.1.1', '100.64.0.1', '0.0.0.0', '::1', 'fd00::1', 'fe80::1', '::ffff:10.0.0.1']) {
    assert.equal(isPublicAddress(ip), false, ip)
    await assert.rejects(assertPublicUrl('https://sneaky.example/', resolvesTo(ip)), PreviewError, ip)
  }
  assert.equal(isPublicAddress('93.184.216.34'), true)
  assert.equal((await assertPublicUrl('https://example.com/rooms/1', resolvesTo('93.184.216.34'))).hostname, 'example.com')
})

test('only the organizer can look up a link', async () => {
  const env = { LOCAL_STORE_PATH: path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'trips-')), 'store.json') }
  const created = await (await handleTrips(new Request('http://test/api/trips', {
    method: 'POST',
    body: JSON.stringify({ name: 'Lisbon Crew', destination: 'Lisbon', start: '2027-03-01', end: '2027-03-03', languageCode: 'pt-PT' }),
  }), env)).json()

  const fetcher = async () => page({ '@type': 'Hotel', name: 'Hotel Exemplo' })
  const ask = (token) => handlePreview(new Request(`http://test/api/preview?id=${created.id}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ url: 'https://example.com/hotel' }),
  }), env, fetcher)

  assert.equal((await ask(null)).status, 403)
  assert.equal((await ask('made-up')).status, 403)
  const ok = await ask(created.editToken)
  assert.equal(ok.status, 200)
  assert.equal((await ok.json()).stay.name, 'Hotel Exemplo')
})
