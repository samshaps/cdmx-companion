// Phase 3 QA: the organiser fills in a trip with the editor, guests see it,
// and later edits (time change, extra day, passcode) reach them.
const fs = require('node:fs')
const { startServer, createRun, joinVideos, assert, field, BASE_URL } = require('./lib.cjs')

const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const visible = (page, text) => page.getByText(text, { exact: false }).first().waitFor({ timeout: 4000 })
const tab = (page, label) => page.getByRole('navigation').getByRole('button', { name: label })
const section = (page, name) => page.getByRole('button', { name, exact: true }).click()
const saved = (page) => page.getByRole('status').filter({ hasText: 'All changes saved' }).waitFor({ timeout: 5000 })
const MAPS_LINK = 'https://www.google.com/maps/place/Alfama/@38.7115,-9.1300,17z/data=!3m1!4b1!4m6!3m5!8m2!3d38.7118!4d-9.1296'

async function createViaApi() {
  const res = await fetch(`${BASE_URL}/api/trips`, {
    method: 'POST',
    body: JSON.stringify({ name: 'Lisbon Crew', emoji: '🇵🇹', destination: 'Lisbon', start: day(-1), end: day(1), homeCurrency: 'USD', localCurrency: 'EUR', languageCode: 'pt-PT' }),
  })
  const { id, editToken } = await res.json()
  return { id, guest: `${BASE_URL}/t/${id}`, edit: `${BASE_URL}/t/${id}/edit#${editToken}` }
}

async function organiserBuilds(links) {
  const run = await createRun('phase3-a')
  const { page } = run

  run.story('Story 1 · Organiser adds the stay')
  await run.step('Open the private edit link and go to Stay', async () => {
    await page.goto(links.edit)
    await page.getByRole('heading', { name: /Lisbon Crew/ }).waitFor()
    await section(page, 'Stay')
  })
  await run.step('Fill in the place, address, wifi and check-in times', async () => {
    await field(page, 'Name of the place').fill('Alfama Rooftop Flat')
    await field(page, 'Address').fill('Rua Exemplo 12, Alfama, Lisbon')
    await field(page, 'Wifi network').fill('AlfamaGuest')
    await field(page, 'Wifi password').fill('pastel-de-nata')
    await field(page, 'Check-in').fill('4:00 PM')
    await field(page, 'Check-out').fill('11:00 AM')
  })
  await run.step('Paste a Google Maps link: the pin is picked out of it', async () => {
    await page.getByLabel('Map pin').fill(MAPS_LINK)
    await visible(page, 'Pinned at 38.7118, -9.1296')
  })
  await run.step('Add a house manual section with the door code; it saves by itself', async () => {
    await page.getByRole('button', { name: '+ Add a section' }).click()
    await field(page, 'Title').fill('Getting in')
    await field(page, 'Details').fill('Blue door, second floor.\nDoor code: 2468#')
    await saved(page)
  })

  run.story('Story 2 · Organiser plans a day')
  await run.step('Go to Schedule, pick today and give the day a title', async () => {
    await section(page, 'Schedule')
    await page.locator('button.rounded-full', { hasText: /\w{3}, \w{3} \d+/ }).nth(1).click()
    await field(page, 'Title for this day').fill('Alfama & fado')
  })
  await run.step('Add a dinner at 8pm with a note', async () => {
    await page.getByRole('button', { name: '+ Add an event' }).click()
    await field(page, 'Time').fill('20:00')
    await field(page, 'Type').selectOption('meal')
    await field(page, 'What').fill('Dinner: Tasca Exemplo')
    await field(page, 'Notes (optional)').fill('Grilled sardines. Cash only.')
    await field(page, 'Highlighted note (optional)').fill('Booked for six')
    await saved(page)
  })

  run.story('Story 3 · Organiser adds a place and a phrase')
  await run.step('Add a bar to Places, with a map pin', async () => {
    await section(page, 'Places')
    await page.getByRole('button', { name: '+ Add a place' }).click()
    await field(page, 'Name').fill('Miradouro Bar')
    await field(page, 'Type').selectOption('drink')
    await field(page, 'Address or neighbourhood').fill('Graça')
    await field(page, 'Why go (optional)').fill('Sunset over the river.')
    await page.getByLabel('Map pin').fill('38.7164, -9.1315')
    await saved(page)
  })
  await run.step('Add a Portuguese phrase', async () => {
    await section(page, 'Phrases')
    await page.getByRole('button', { name: '+ Add a phrase' }).click()
    await field(page, 'In English').fill('Thank you')
    await field(page, 'Translation').fill('Obrigado')
    await field(page, 'Sounds like (optional)').fill('oh-bree-GAH-doo')
    await saved(page)
  })
  return run.finish()
}

async function guestSees(links) {
  const run = await createRun('phase3-b', {
    contextOptions: { permissions: ['geolocation'], geolocation: { latitude: 38.7118, longitude: -9.1296 } },
  })
  const { page, context } = run
  await context.route('https://open.er-api.com/**', (route) => route.fulfill({ json: { result: 'success', rates: { EUR: 0.9 } } }))

  run.story('Story 4 · Guest sees it all')
  await run.step('Home shows the stay, wifi and door code', async () => {
    await page.goto(links.guest)
    await visible(page, 'Rua Exemplo 12, Alfama, Lisbon')
    await visible(page, 'AlfamaGuest')
    await visible(page, '4:00 PM')
    await page.getByText('Door code: 2468#').scrollIntoViewIfNeeded()
  })
  await run.step('The Uber button goes to the pinned spot', async () => {
    const uber = await page.getByRole('link', { name: 'Uber' }).getAttribute('href')
    assert(uber.includes('38.7118') && uber.includes('-9.1296'), `uber link was ${uber}`)
  })
  await run.step('Schedule shows tonight’s dinner with its notes', async () => {
    await tab(page, 'Schedule').click()
    await visible(page, 'Alfama & fado')
    await visible(page, '8:00 PM')
    await visible(page, 'Dinner: Tasca Exemplo')
    await visible(page, 'Booked for six')
  })
  await run.step('Phrases has the Portuguese phrase', async () => {
    await tab(page, 'Phrases').click()
    await visible(page, 'Obrigado')
    await visible(page, 'oh-bree-GAH-doo')
  })
  await run.step('Explore shows the bar and how far away it is', async () => {
    await tab(page, 'Explore').click()
    await visible(page, 'Miradouro Bar')
    await visible(page, '0.3 mi')
  })
  return run.finish()
}

async function organiserChanges(links) {
  const run = await createRun('phase3-c')
  const { page } = run

  run.story('Story 5 · Plans change mid-trip')
  await run.step('Organiser moves dinner to 9pm', async () => {
    await page.goto(links.edit)
    await section(page, 'Schedule')
    await page.locator('button.rounded-full', { hasText: /\w{3}, \w{3} \d+/ }).nth(1).click()
    await field(page, 'Time').fill('21:00')
    await saved(page)
  })
  await run.step('Organiser extends the trip by a day: the schedule gains a day, plans are kept', async () => {
    await section(page, 'Basics')
    await field(page, 'Last day').fill(day(2))
    await saved(page)
    await section(page, 'Schedule')
    assert((await page.locator('button.rounded-full', { hasText: /\w{3}, \w{3} \d+/ }).count()) === 4, 'expected 4 days')
    await page.locator('button.rounded-full', { hasText: /\w{3}, \w{3} \d+/ }).nth(1).click()
    assert((await field(page, 'What').inputValue()) === 'Dinner: Tasca Exemplo', 'dinner should survive the date change')
  })
  await run.step('Organiser turns on a guest passcode', async () => {
    await section(page, 'Basics')
    await page.getByLabel('New passcode').fill('sardine')
    await page.getByRole('button', { name: 'Set', exact: true }).click()
    await visible(page, 'passcode on')
  })
  await run.step('Organiser downloads a backup of the trip', async () => {
    await section(page, 'Share')
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export trip' }).click()])
    const exported = JSON.parse(fs.readFileSync(await download.path(), 'utf8'))
    assert(exported.trip.stay.wifi.network === 'AlfamaGuest' && exported.itinerary.length === 4, 'backup should hold the full trip')
  })
  await run.step('A bad edit is reported, not silently lost: clearing the trip name', async () => {
    await section(page, 'Basics')
    await field(page, 'Trip name').fill('')
    await page.getByRole('status').filter({ hasText: 'Not saved: Give the trip a name' }).waitFor({ timeout: 5000 })
    await field(page, 'Trip name').fill('Lisbon Crew')
    await saved(page)
  })
  return run.finish()
}

async function guestSeesChanges(links) {
  const run = await createRun('phase3-d')
  const { page } = run

  run.story('Story 6 · Guests get the changes')
  await run.step('The trip now asks for the passcode', async () => {
    await page.goto(links.guest)
    await visible(page, 'Enter the passcode')
    await page.getByLabel('Passcode').fill('sardine')
    await page.getByRole('button', { name: 'Open trip' }).click()
    await visible(page, 'Day 2 of 4!')
  })
  await run.step('Dinner shows at its new time, and there is a fourth day', async () => {
    await tab(page, 'Schedule').click()
    await visible(page, '9:00 PM')
    assert((await page.getByText('8:00 PM').count()) === 0, 'old time should be gone')
    assert((await page.locator('button.rounded-full.min-w-\\[56px\\]').count()) === 4, 'expected 4 day buttons')
  })
  return run.finish()
}

;(async () => {
  const stop = await startServer()
  let failed = 1
  try {
    const links = await createViaApi()
    const runs = [await organiserBuilds(links), await guestSees(links), await organiserChanges(links), await guestSeesChanges(links)]
    failed = runs.reduce((n, r) => n + r.failed, 0)
    joinVideos('phase3', runs.map((r) => r.mp4))
  } finally {
    stop()
  }
  process.exit(failed ? 1 : 0)
})()
