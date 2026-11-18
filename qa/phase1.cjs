// Phase 1 QA: a guest's happy path through the companion app, first on the
// bundled demo trip, then on a completely different trip to prove nothing
// about the destination is hardcoded.
const { startServer, createRun, joinVideos, assert, BASE_URL } = require('./lib.cjs')
const paris = require('./fixtures/paris.cjs')

const RATES = { USD: { MXN: 18.5 }, GBP: { EUR: 1.2 } }

async function mockExchangeRates(context) {
  await context.route('https://open.er-api.com/**', (route) => {
    const base = route.request().url().split('/').pop()
    route.fulfill({ json: { result: 'success', rates: RATES[base] || {} } })
  })
}

const tab = (page, label) => page.getByRole('navigation').getByRole('button', { name: label })
const visible = (page, text) => page.getByText(text, { exact: false }).first().waitFor({ timeout: 4000 })

async function demoTrip() {
  const run = await createRun('phase1-a-demo-trip', {
    contextOptions: {
      permissions: ['geolocation', 'clipboard-read', 'clipboard-write'],
      geolocation: { latitude: 19.4116, longitude: -99.1694 }, // Parque México
    },
  })
  const { page, context } = run
  await mockExchangeRates(context)

  run.story('Story 1 · Guest finds the stay details')
  await run.step('Open the app: trip name, live day counter and stay address show', async () => {
    await page.goto(`${BASE_URL}/demo`)
    await visible(page, 'Amigos en CDMX')
    await visible(page, 'Day 2 of 5!')
    await visible(page, 'Calle Ejemplo 123')
    assert((await page.title()) === 'Amigos en CDMX', 'page title should be the trip name')
  })
  await run.step('Tap Copy on the wifi card: password lands on the clipboard', async () => {
    await page.getByRole('button', { name: 'Copy' }).click()
    await visible(page, 'Copied!')
    const clip = await page.evaluate(() => navigator.clipboard.readText())
    assert(clip === 'tacos-al-pastor-2026', `clipboard was "${clip}"`)
  })
  await run.step('Uber and maps buttons point at the stay', async () => {
    const uber = await page.getByRole('link', { name: 'Uber' }).getAttribute('href')
    const maps = await page.getByRole('link', { name: 'Google Maps' }).getAttribute('href')
    assert(uber.includes('Casa+Jacaranda') && uber.includes('19.4116'), 'Uber link should carry stay name + coordinates')
    assert(decodeURIComponent(maps).includes('Calle Ejemplo 123'), 'Maps link should carry stay address')
  })
  await run.step('Scroll to the house manual: free-form sections render', async () => {
    await page.getByText('Good to Know').scrollIntoViewIfNeeded()
    for (const title of ['Building & Access', 'Getting There', 'Amenities', 'Good to Know']) await visible(page, title)
    await visible(page, 'Door code: 1234#')
  })

  run.story('Story 2 · Guest checks the schedule')
  await run.step('Open Schedule: today (day 2) is preselected', async () => {
    await tab(page, 'Schedule').click()
    await visible(page, 'Pyramids & Night Out')
    await visible(page, 'Hot air balloon flight')
  })
  await run.step('Switch to the first day: its events replace the list', async () => {
    await page.locator('button:has-text("✈️")').first().click()
    await visible(page, 'Arrival Day')
    await visible(page, 'Check in at Casa Jacaranda')
    assert((await page.getByText('Hot air balloon flight').count()) === 0, 'day 2 events should be gone')
  })

  run.story('Story 3 · Guest looks up a phrase')
  await run.step('Open Phrases: categories come from the trip data', async () => {
    await tab(page, 'Phrases').click()
    for (const c of ['Greetings', 'Restaurant', 'Directions', 'Shopping', 'Emergency']) await page.getByRole('button', { name: c }).waitFor()
    await visible(page, 'Buenas tardes')
  })
  await run.step('Tap Restaurant: restaurant phrases show with pronunciation', async () => {
    await page.getByRole('button', { name: 'Restaurant' }).click()
    await visible(page, 'La cuenta, por favor')
    assert((await page.getByText('Buenas tardes').count()) === 0, 'greetings should be filtered out')
    const href = await page.getByRole('link', { name: /Google Translate/ }).getAttribute('href')
    assert(href.endsWith('tl=es'), 'translate link should target Spanish')
  })

  run.story('Story 4 · Guest converts money')
  await run.step('Open Money: live USD → MXN rate shows', async () => {
    await tab(page, 'Money').click()
    await visible(page, '1 USD = 18.50 MXN')
  })
  await run.step('Type 20 dollars: converts to MX$370.00', async () => {
    await page.getByPlaceholder('0.00').fill('20')
    await visible(page, 'MX$370.00')
  })
  await run.step('Tap the 500-peso quick button: flips direction, shows $27.03', async () => {
    await page.getByRole('button', { name: 'MX$500' }).click()
    await visible(page, '$27.03')
  })

  run.story('Story 5 · Guest explores nearby places')
  await run.step('Open Explore: places sort by distance from the guest', async () => {
    await tab(page, 'Explore').click()
    await visible(page, 'Sorted by distance from you')
    const miles = await page.locator('span:has-text(" mi")').allTextContents()
    const nums = miles.map(parseFloat)
    assert(nums.length > 10, 'expected a list of places with distances')
    assert(nums.every((n, i) => i === 0 || n >= nums[i - 1]), 'distances should ascend')
  })
  await run.step('Filter to Drink: only bars remain', async () => {
    const before = await page.locator('h3').count()
    await page.getByRole('button', { name: /Drink/ }).click()
    const after = await page.locator('h3').count()
    assert(after > 0 && after < before, `expected fewer places (before ${before}, after ${after})`)
  })

  return run.finish()
}

async function differentTrip() {
  const run = await createRun('phase1-b-different-trip')
  const { page, context } = run
  await mockExchangeRates(context)
  // Swap the bundled trip for the Paris fixture at the network layer, so the
  // unmodified app renders someone else's trip.
  await context.route('**/src/data/demo-trip.json*', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: `export default ${JSON.stringify(paris)}` }))

  run.story('Story 6 · Same app, a Paris trip')
  await run.step('Home shows the Paris trip, stay and wifi', async () => {
    await page.goto(`${BASE_URL}/demo`)
    await visible(page, 'Paris Long Weekend')
    await visible(page, '10 Rue Exemple')
    await visible(page, 'MaraisGuest')
    await visible(page, 'Code: 2468')
  })
  await run.step('Schedule shows the Paris itinerary; map links search in Paris', async () => {
    await tab(page, 'Schedule').click()
    await visible(page, 'Museums')
    await visible(page, 'Louvre')
    // The Louvre event has no address, so the link falls back to "<name> <destination>".
    const href = await page.getByRole('link', { name: 'Google' }).first().getAttribute('href')
    assert(decodeURIComponent(href).endsWith('destination=Louvre Paris'), `map link was ${href}`)
  })
  await run.step('Phrases are French, with this trip’s own categories', async () => {
    await tab(page, 'Phrases').click()
    await page.getByRole('button', { name: 'Basics' }).waitFor()
    await page.getByRole('button', { name: 'Café' }).click()
    await visible(page, 'Un café, s’il vous plaît')
    const href = await page.getByRole('link', { name: /Google Translate/ }).getAttribute('href')
    assert(href.endsWith('tl=fr'), 'translate link should target French')
  })
  await run.step('Money converts pounds to euros', async () => {
    await tab(page, 'Money').click()
    await visible(page, '1 GBP = 1.20 EUR')
    await page.getByPlaceholder('0.00').fill('50')
    await visible(page, '€60.00')
  })
  await run.step('Explore lists the Paris places', async () => {
    await tab(page, 'Explore').click()
    await visible(page, 'Du Pain et des Idées')
  })
  await run.step('No trace of Mexico City anywhere in the app', async () => {
    for (const label of ['Home', 'Schedule', 'Phrases', 'Money', 'Explore']) {
      await tab(page, label).click()
      const text = await page.locator('body').innerText()
      assert(!/cdmx|mexico|MXN|peso|airbnb/i.test(text), `found Mexico-specific text on ${label}`)
    }
  })

  return run.finish()
}

;(async () => {
  const stop = await startServer()
  let failed = 0
  try {
    const runs = [await demoTrip(), await differentTrip()]
    failed = runs.reduce((n, r) => n + r.failed, 0)
    joinVideos('phase1', runs.map((r) => r.mp4))
  } finally {
    stop()
  }
  process.exit(failed ? 1 : 0)
})()
