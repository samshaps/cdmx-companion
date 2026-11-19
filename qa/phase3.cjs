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
  const { page, context } = run
  // The listing site is stood in for here; reading real pages is covered by unit tests.
  await context.route('**/api/preview**', (route) => route.fulfill({
    json: { stay: { name: 'Alfama Rooftop Flat', photo: '/images/demo-stay.svg', address: '', area: 'Lisbon', lat: null, lng: null, checkIn: '', checkOut: '' } },
  }))

  run.story('Story 1 · Organiser adds the stay')
  await run.step('Open the private edit link and go to Stay', async () => {
    await page.goto(links.edit)
    await page.getByRole('heading', { name: /Lisbon Crew/ }).waitFor()
    await section(page, 'Stay')
  })
  await run.step('Paste the Airbnb link: name and photo are filled in from the listing', async () => {
    await page.getByLabel('Link to the place').fill('https://www.airbnb.com/rooms/12345')
    await page.getByRole('button', { name: 'Fill in from link' }).click()
    await visible(page, 'Filled in the name, photo')
    await visible(page, 'paste that below from your booking confirmation')
    assert((await field(page, 'Name of the place').inputValue()) === 'Alfama Rooftop Flat', 'name should come from the listing')
    assert((await field(page, 'Photo link (optional)').inputValue()) === '/images/demo-stay.svg', 'photo should come from the listing')
  })
  await run.step('Type in the rest: address, wifi and check-in times', async () => {
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
  await run.step('The day has ready-made blanks from Breakfast to Evening', async () => {
    for (const slot of ['breakfast', 'morning', 'lunch', 'afternoon', 'dinner', 'evening']) await page.getByTestId(`slot-${slot}`).waitFor()
    await page.getByTestId('slot-dinner').scrollIntoViewIfNeeded()
  })
  await run.step('Type into Dinner: it becomes an event at a sensible default time', async () => {
    await page.getByLabel('Dinner', { exact: true }).fill('Dinner: Tasca Exemplo')
    await page.getByTestId('slot-dinner').getByText('7:30 PM').waitFor()
  })
  await run.step('Open its details to set the real time and add notes', async () => {
    await page.getByTestId('slot-dinner').getByRole('button', { name: 'Time, place & notes' }).click()
    await field(page, 'Time').fill('20:00')
    await field(page, 'Notes (optional)').fill('Grilled sardines. Cash only.')
    await field(page, 'Highlighted note (optional)').fill('Booked for six')
    await saved(page)
  })
  await run.step('Fill Breakfast too; the other blanks are left empty', async () => {
    await page.getByLabel('Breakfast', { exact: true }).fill('Pastéis at the corner café')
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
  await run.step('Phrases already holds a starter phrase book in Portuguese', async () => {
    await section(page, 'Phrases')
    assert((await field(page, 'Translation').count()) === 17, 'expected 17 starter phrases')
    assert((await field(page, 'Translation').nth(1).inputValue()) === 'Obrigado / Obrigada', 'second phrase should be thank you')
  })
  await run.step('Add one of their own', async () => {
    await page.getByRole('button', { name: '+ Add a phrase' }).click()
    await field(page, 'In English').last().fill('Cheers!')
    await field(page, 'Translation').last().fill('Saúde!')
    await field(page, 'Sounds like (optional)').last().fill('sah-OO-deh')
    await field(page, 'Group').last().fill('basics')
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
    await visible(page, 'Pastéis at the corner café')
    assert((await page.getByText('Nothing planned').count()) === 0, 'empty blanks should not reach guests')
  })
  await run.step('Phrases has the starter book plus the organiser’s own phrase', async () => {
    await tab(page, 'Phrases').click()
    await visible(page, 'Obrigado / Obrigada')
    await visible(page, 'Saúde!')
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
    await page.getByTestId('slot-dinner').getByRole('button', { name: 'Time, place & notes' }).click()
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
    assert((await page.getByLabel('Dinner', { exact: true }).inputValue()) === 'Dinner: Tasca Exemplo', 'dinner should survive the date change')
  })
  await run.step('Organiser turns on a guest passcode', async () => {
    await section(page, 'Basics')
    await page.getByLabel('New passcode').fill('sardine')
    await page.getByRole('button', { name: 'Set', exact: true }).click()
    await visible(page, 'passcode on')
  })
  await run.step('Organiser downloads a backup of the trip', async () => {
    await section(page, 'Basics')
    await page.getByRole('button', { name: 'Export trip' }).scrollIntoViewIfNeeded()
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
    assert((await page.locator('button.min-w-\\[56px\\]').count()) === 4, 'expected 4 day buttons')
  })
  return run.finish()
}

async function longTrip() {
  const res = await fetch(`${BASE_URL}/api/trips`, {
    method: 'POST',
    body: JSON.stringify({ name: 'Two Weeks in Japan', destination: 'Tokyo', start: day(-8), end: day(5), homeCurrency: 'USD', localCurrency: 'JPY', languageCode: 'ja-JP' }),
  })
  const { id } = await res.json()
  const run = await createRun('phase3-e')
  const { page } = run

  run.story('Story 7 · A two-week trip on a phone')
  await run.step('The schedule fits the screen: 14 days scroll sideways, today is in view', async () => {
    await page.goto(`${BASE_URL}/t/${id}`)
    await tab(page, 'Schedule').click()
    await visible(page, 'Day 9')
    const { content, screen } = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, screen: window.innerWidth }))
    assert(content <= screen, `page is ${content}px wide on a ${screen}px screen`)
    assert((await page.locator('button.min-w-\\[56px\\]').count()) === 14, 'expected 14 day buttons')
    const today = await page.locator('button.bg-teal.min-w-\\[56px\\]').boundingBox()
    assert(today.x >= 0 && today.x + today.width <= screen, 'today should be scrolled into view')
  })
  await run.step('Swiping the day strip reaches the last day', async () => {
    await page.locator('button.min-w-\\[56px\\]').last().scrollIntoViewIfNeeded()
    await page.locator('button.min-w-\\[56px\\]').last().click()
    await visible(page, 'Departure')
  })
  return run.finish()
}

;(async () => {
  const stop = await startServer()
  let failed = 1
  try {
    const links = await createViaApi()
    const runs = [await organiserBuilds(links), await guestSees(links), await organiserChanges(links), await guestSeesChanges(links), await longTrip()]
    failed = runs.reduce((n, r) => n + r.failed, 0)
    joinVideos('phase3', runs.map((r) => r.mp4))
  } finally {
    stop()
  }
  process.exit(failed ? 1 : 0)
})()
