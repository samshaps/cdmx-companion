// Phase 5 QA: the app speaks the visitor's language. A French browser gets
// French throughout, the trip it creates is French for guests too (whatever
// their own browser says), and the phrase book runs French → Portuguese.
const { startServer, createRun, joinVideos, assert, BASE_URL } = require('./lib.cjs')

const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const visible = (page, text) => page.getByText(text, { exact: false }).first().waitFor({ timeout: 4000 })

async function frenchOrganizer(fr) {
  const run = await createRun('phase5-a', { contextOptions: { locale: 'fr-FR' } })
  const { page } = run
  const links = {}

  run.story('Story 1 · A visitor whose browser is in French')
  await run.step('The landing page is in French, and the corner picker says so', async () => {
    await page.goto(BASE_URL)
    await page.getByRole('link', { name: fr['Create a trip'] }).waitFor()
    await visible(page, fr['See the demo trip'])
    assert((await page.getByLabel(fr['Language']).inputValue()) === 'fr', 'picker should show French')
    assert((await page.getByText('Create a trip', { exact: true }).count()) === 0, 'no English should be left on the buttons')
  })
  await run.step('Switching the picker to English changes the page at once; back to French', async () => {
    await page.getByLabel(fr['Language']).selectOption('en')
    await page.getByRole('link', { name: 'Create a trip' }).waitFor()
    await page.getByLabel('Language').selectOption('fr')
    await page.getByRole('link', { name: fr['Create a trip'] }).waitFor()
  })
  await run.step('The create form is in French; pick Lisbon and create the trip', async () => {
    await page.getByRole('link', { name: fr['Create a trip'] }).click()
    await page.getByLabel(fr['Trip name']).fill('Lisbonne entre amis')
    await page.getByLabel(fr['Destination']).pressSequentially('Lis', { delay: 100 })
    await page.getByRole('option', { name: /Lisbon, Portugal/ }).click()
    await page.getByRole('button', { name: fr['Keep them'] }).click()
    await page.getByLabel(fr['First day']).fill(day(-1))
    await page.getByLabel(fr['Last day']).fill(day(1))
    await page.getByRole('button', { name: fr['Create trip'] }).click()
    await page.getByRole('heading', { name: /Lisbonne entre amis/ }).waitFor()
  })
  await run.step('The editor is in French, with French day titles', async () => {
    await page.getByRole('button', { name: fr['Schedule'], exact: true }).click()
    assert((await page.getByLabel(fr['Title for this day']).inputValue()) === fr['Arrival'], 'first day should have a French title')
    await page.getByLabel(fr['Dinner'], { exact: true }).waitFor()
  })
  await run.step('The phrase book runs French → Portuguese', async () => {
    await page.getByRole('button', { name: fr['Phrases'], exact: true }).click()
    const mine = page.locator('label', { has: page.locator('span', { hasText: new RegExp(`^${fr['In English']}$`) }) }).locator('input')
    assert((await mine.nth(1).inputValue()) === 'Merci', `second phrase was ${await mine.nth(1).inputValue()}`)
    await visible(page, fr['Translation'])
  })
  await run.step('Share shows the two links, explained in French', async () => {
    await page.getByRole('button', { name: fr['Share'], exact: true }).click()
    await visible(page, fr['For everyone on the trip'])
    links.guest = (await page.getByTestId('guest-link').textContent()).trim()
  })
  return { ...(await run.finish()), links }
}

async function englishGuest(fr, links) {
  // A guest whose own phone is in English still gets the trip in French.
  const run = await createRun('phase5-b', { contextOptions: { locale: 'en-US', permissions: ['geolocation'], geolocation: { latitude: 38.7118, longitude: -9.1296 } } })
  const { page, context } = run
  await context.route('https://open.er-api.com/**', (route) => route.fulfill({ json: { result: 'success', rates: { EUR: 0.9 } } }))

  run.story('Story 2 · Guests see the trip in the organizer’s language')
  await run.step('Tabs, day counter and empty states are in French', async () => {
    await page.goto(links.guest)
    await visible(page, fr['Day {day} of {total}!'].replace('{day}', '2').replace('{total}', '3'))
    for (const tab of ['Home', 'Schedule', 'Phrases', 'Money', 'Explore']) {
      await page.getByRole('navigation').getByRole('button', { name: fr[tab] }).waitFor()
    }
  })
  await run.step('Schedule uses French weekdays', async () => {
    await page.getByRole('navigation').getByRole('button', { name: fr['Schedule'] }).click()
    const weekday = new Date().toLocaleDateString('fr', { weekday: 'long' })
    await visible(page, weekday)
    await visible(page, fr['Nothing planned for this day yet.'])
  })
  await run.step('Phrases lists French next to Portuguese', async () => {
    await page.getByRole('navigation').getByRole('button', { name: fr['Phrases'] }).click()
    await visible(page, 'Merci')
    await visible(page, 'Obrigado / Obrigada')
  })
  return run.finish()
}

;(async () => {
  const fr = (await import('../shared/i18n/fr.js')).default
  const stop = await startServer()
  let failed = 1
  try {
    const a = await frenchOrganizer(fr)
    const b = await englishGuest(fr, a.links)
    failed = a.failed + b.failed
    joinVideos('phase5', [a.mp4, b.mp4])
  } finally {
    stop()
  }
  process.exit(failed ? 1 : 0)
})()
