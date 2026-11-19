// Phase 2 QA: an organiser creates a trip and gets two links; a guest on a
// different phone opens the guest link. Also checks the access rules.
const { startServer, createRun, joinVideos, assert, BASE_URL } = require('./lib.cjs')

const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const visible = (page, text) => page.getByText(text, { exact: false }).first().waitFor({ timeout: 4000 })
const tab = (page, label) => page.getByRole('navigation').getByRole('button', { name: label })
const ORIGINAL_TEAL = '26 83 92'
const PORTUGAL_GREEN = '0 104 71'
const primaryColour = (page) => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--c-primary').trim())
const api = (id) => `${BASE_URL}/api/trips?id=${encodeURIComponent(id)}`

async function organiser() {
  const run = await createRun('phase2-a-organiser', { contextOptions: { permissions: ['clipboard-read', 'clipboard-write'] } })
  const { page } = run
  const links = {}

  run.story('Story 1 · Organiser creates a trip')
  await run.step('Open the site and tap "Create a trip"', async () => {
    await page.goto(BASE_URL)
    await visible(page, 'Trip Companion')
    await page.getByRole('link', { name: 'Create a trip' }).click()
    await page.getByRole('heading', { name: 'Create a trip' }).waitFor()
  })
  await run.step('Type "Lis" in Destination: a picklist narrows to matching places', async () => {
    await page.getByLabel('Trip name').fill('Lisbon Crew')
    await page.getByLabel('Destination').pressSequentially('Lis', { delay: 120 })
    await page.getByRole('option', { name: /Lisbon, Portugal/ }).waitFor()
    await page.getByRole('option', { name: /Use “Lis”/ }).waitFor()
  })
  await run.step('Pick Lisbon: flag, currency and language are set, with a phrase book to come', async () => {
    await page.getByRole('option', { name: /Lisbon, Portugal/ }).click()
    assert((await page.getByLabel('Destination').inputValue()) === 'Lisbon, Portugal', 'destination should be the picked place')
    await visible(page, 'Your trip starts with a phrase book in this language')
    assert((await page.getByLabel('Local currency').inputValue()) === 'EUR', 'local currency should be EUR')
    assert((await page.getByLabel('Local language').inputValue()) === 'pt-PT', 'language should be Portuguese')
  })
  await run.step('The page changes into Portugal’s flag colours and says “Olá!”', async () => {
    await page.getByRole('status', { name: 'Trip colours changed' }).waitFor()
    await visible(page, 'Olá!')
    await visible(page, 'wearing the colours of Portugal’s flag')
    assert((await primaryColour(page)) === PORTUGAL_GREEN, `primary colour was ${await primaryColour(page)}`)
  })
  await run.step('US states work too: Texas says “Howdy!”, and “Back to the original” undoes its colours', async () => {
    await page.getByLabel('Destination').fill('Tex')
    await page.getByRole('option', { name: /Texas, USA/ }).click()
    await visible(page, 'Howdy!')
    assert((await page.getByLabel('Local currency').inputValue()) === 'USD', 'Texas should use dollars')
    await page.getByRole('button', { name: 'Back to the original' }).click()
    assert((await primaryColour(page)) === ORIGINAL_TEAL, 'colours should revert')
  })
  await run.step('Back to Lisbon, and this time keep the colours', async () => {
    await page.getByLabel('Destination').fill('Lisb')
    await page.getByRole('option', { name: /Lisbon, Portugal/ }).click()
    await page.getByRole('button', { name: 'Keep them' }).click()
    assert((await primaryColour(page)) === PORTUGAL_GREEN, 'Portugal colours should be back')
    assert((await page.getByRole('status', { name: 'Trip colours changed' }).count()) === 0, 'popup should be gone')
  })
  await run.step('Pick dates and set a guest passcode', async () => {
    await page.getByLabel('First day').fill(day(-1))
    await page.getByLabel('Last day').fill(day(1))
    await page.getByLabel(/Guest passcode/).fill('sardine')
    await page.getByLabel(/Guest passcode/).scrollIntoViewIfNeeded()
  })
  await run.step('Tap "Create trip": the editor opens on Basics, flag and all', async () => {
    await page.getByRole('button', { name: 'Create trip' }).click()
    await page.getByRole('heading', { name: /🇵🇹 Lisbon Crew/ }).waitFor()
    await visible(page, 'passcode on')
    assert((await page.getByLabel('Trip name').inputValue()) === 'Lisbon Crew', 'Basics should be the first tab')
  })
  await run.step('Tap Share at the bottom: guest link and edit link, each explained', async () => {
    await page.getByRole('button', { name: 'Share', exact: true }).click()
    await visible(page, 'For everyone on the trip')
    await visible(page, 'For you and co-organisers only')
    links.guest = (await page.getByTestId('guest-link').textContent()).trim()
    links.edit = (await page.getByTestId('edit-link').textContent()).trim()
    assert(/\/t\/lisbon-crew-[\w-]+$/.test(links.guest), `guest link was ${links.guest}`)
    assert(links.edit.startsWith(links.guest + '/edit#') && links.edit.split('#')[1].length >= 30, 'edit link should carry a long secret')
  })
  await run.step('Tap "Copy guest link": it is on the clipboard, ready for the group chat', async () => {
    await page.getByRole('button', { name: 'Copy guest link' }).click()
    assert((await page.evaluate(() => navigator.clipboard.readText())) === links.guest, 'clipboard should hold the guest link')
    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).last().click()
  })
  await run.step('Basics has a Colours switch: original and back to the flag', async () => {
    await page.getByRole('button', { name: 'Back to the original colours' }).scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Back to the original colours' }).click()
    assert((await primaryColour(page)) === ORIGINAL_TEAL, 'editor should return to the original colours')
    await page.getByRole('button', { name: /Use Portugal’s colours/ }).click()
    assert((await primaryColour(page)) === PORTUGAL_GREEN, 'editor should wear the flag colours again')
    await page.getByRole('status').filter({ hasText: 'All changes saved' }).waitFor()
  })
  await run.step('Share stays at the bottom of every section', async () => {
    for (const name of ['Stay', 'Schedule', 'Places', 'Phrases']) {
      await page.getByRole('button', { name, exact: true }).click()
      await page.getByRole('button', { name: 'Share', exact: true }).waitFor()
    }
  })

  run.story('Story 2 · Organiser comes back later')
  await run.step('Back on the home page, "Your trips" remembers the trip on this device', async () => {
    await page.goto(BASE_URL)
    await visible(page, 'Your trips')
    await page.getByRole('link', { name: /Lisbon Crew/ }).click()
  })
  await run.step('It reopens the organiser page without needing the edit link again', async () => {
    await page.getByRole('heading', { name: /Lisbon Crew/ }).waitFor()
    await page.getByRole('button', { name: 'Share', exact: true }).click()
    assert((await page.getByTestId('edit-link').textContent()).trim() === links.edit, 'edit link should be unchanged')
  })

  return { ...(await run.finish()), links }
}

async function guest(links) {
  const run = await createRun('phase2-b-guest')
  const { page, context } = run
  const id = links.guest.split('/t/')[1]
  const token = links.edit.split('#')[1]
  await context.route('https://open.er-api.com/**', (route) =>
    route.fulfill({ json: { result: 'success', rates: { EUR: 0.9 } } }))

  run.story('Story 3 · Guest opens the link')
  await run.step('Open the guest link: the trip asks for the passcode', async () => {
    await page.goto(links.guest)
    await page.getByRole('heading', { name: 'Lisbon Crew' }).waitFor()
    await visible(page, 'Enter the passcode')
  })
  await run.step('A wrong passcode is turned away', async () => {
    await page.getByLabel('Passcode').fill('anchovy')
    await page.getByRole('button', { name: 'Open trip' }).click()
    await visible(page, 'That passcode is not right')
  })
  await run.step('The right passcode opens the trip, already on day 2 of 3', async () => {
    await page.getByLabel('Passcode').fill('sardine')
    await page.getByRole('button', { name: 'Open trip' }).click()
    await visible(page, 'Day 2 of 3!')
    await visible(page, 'Stay details have not been added yet')
    assert((await primaryColour(page)) === PORTUGAL_GREEN, 'guests should see the flag colours')
  })
  await run.step('Schedule has one day per date, ready to be filled in', async () => {
    await tab(page, 'Schedule').click()
    await visible(page, 'Day 2')
    await visible(page, 'Nothing planned for this day yet')
    assert((await page.locator('button:has-text("✈️")').count()) === 2, 'first and last day should be travel days')
  })
  await run.step('Money is set up for dollars to euros', async () => {
    await tab(page, 'Money').click()
    await visible(page, '1 USD = 0.90 EUR')
  })

  run.story('Story 4 · Changes reach guests')
  await run.step('Organiser saves wifi details and a dinner (via the API, editor comes in phase 3)', async () => {
    const current = await (await fetch(api(id), { headers: { Authorization: `Bearer ${token}` } })).json()
    const doc = current.doc
    doc.trip.stay.wifi = { network: 'AlfamaGuest', password: 'pastel-de-nata' }
    doc.itinerary[1].events.push({ time: '20:00', name: 'Dinner: Tasca Exemplo', category: 'meal', notes: 'Booked for six.' })
    const res = await fetch(api(id), { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ doc }) })
    assert(res.status === 200, `save returned ${res.status}`)
  })
  await run.step('Guest reopens the app: no passcode prompt this time, and the wifi is there', async () => {
    await page.reload()
    await visible(page, 'AlfamaGuest')
    assert((await page.getByText('Enter the passcode').count()) === 0, 'passcode should be remembered')
  })
  await run.step('The new dinner is on today’s schedule', async () => {
    await tab(page, 'Schedule').click()
    await visible(page, 'Dinner: Tasca Exemplo')
  })

  run.story('Story 5 · Guest loses signal')
  await run.step('With the server unreachable, the app still opens from the saved copy', async () => {
    await context.route('**/api/trips**', (route) => route.abort())
    await page.reload()
    await visible(page, 'Offline · showing the copy saved on this phone')
    await visible(page, 'AlfamaGuest')
    await context.unroute('**/api/trips**')
  })

  run.story('Story 6 · Access rules hold')
  await run.step('Without the passcode the server sends no trip details at all', async () => {
    const res = await fetch(api(id))
    const body = await res.text()
    assert(res.status === 401, `status was ${res.status}`)
    assert(!body.includes('AlfamaGuest') && !body.includes('pastel-de-nata'), 'response leaked trip content')
  })
  await run.step('Saving without the edit link, or with a made-up one, is refused', async () => {
    const body = JSON.stringify({ doc: {} })
    const none = await fetch(api(id), { method: 'PUT', body })
    const fake = await fetch(api(id), { method: 'PUT', body, headers: { Authorization: 'Bearer not-the-real-token' } })
    assert(none.status === 401 && fake.status === 403, `statuses were ${none.status} and ${fake.status}`)
  })
  await run.step('A guest who guesses the organiser page address is locked out', async () => {
    await page.goto(`${links.guest}/edit`)
    await visible(page, 'Can’t open the organiser page')
  })
  await run.step('A mistyped trip link says so plainly', async () => {
    await page.goto(`${BASE_URL}/t/not-a-real-trip`)
    await visible(page, 'Trip not found')
  })
  await run.step('Installing to the home screen would install this trip, not the landing page', async () => {
    const manifest = await (await fetch(`${BASE_URL}/api/manifest?id=${id}`)).json()
    assert(manifest.name === 'Lisbon Crew' && manifest.start_url === `/t/${id}`, JSON.stringify(manifest))
    await page.goto(links.guest)
    const href = await page.locator('link[rel="manifest"]').getAttribute('href')
    assert(href === `/api/manifest?id=${id}`, `manifest link was ${href}`)
  })

  return run.finish()
}

;(async () => {
  const stop = await startServer()
  let failed = 1
  try {
    const a = await organiser()
    const b = await guest(a.links)
    failed = a.failed + b.failed
    joinVideos('phase2', [a.mp4, b.mp4])
  } finally {
    stop()
  }
  process.exit(failed ? 1 : 0)
})()
