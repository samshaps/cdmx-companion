// Phase 4 QA: first-time visitors on a phone are walked through adding the
// trip to their home screen, with the right steps for their device.
const { startServer, createRun, joinVideos, assert, BASE_URL } = require('./lib.cjs')

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'
const INSTAGRAM = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 390.0.0.28.85'

const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const visible = (page, text) => page.getByText(text, { exact: false }).first().waitFor({ timeout: 4000 })
const guide = (page) => page.getByRole('dialog', { name: 'Add to home screen' })
const next = (page) => page.getByRole('button', { name: 'Next' }).click()

async function createViaApi() {
  const res = await fetch(`${BASE_URL}/api/trips`, {
    method: 'POST',
    body: JSON.stringify({ name: 'Lisbon Crew', emoji: '🇵🇹', destination: 'Lisbon', start: day(-1), end: day(1), homeCurrency: 'USD', localCurrency: 'EUR', languageCode: 'pt-PT' }),
  })
  const { id, editToken } = await res.json()
  return { id, token: editToken, guest: `${BASE_URL}/t/${id}`, edit: `${BASE_URL}/t/${id}/edit#${editToken}` }
}

async function iphoneGuest(links) {
  const run = await createRun('phase4-a', { contextOptions: { userAgent: IPHONE } })
  const { page } = run

  run.story('Story 1 · Guest on an iPhone, first visit')
  await run.step('Opening the guest link offers to put the trip on the home screen', async () => {
    await page.goto(links.guest)
    await guide(page).waitFor()
    await visible(page, 'Put Lisbon Crew on your home screen')
  })
  await run.step('Step 1 shows Safari’s Share button, ringed', async () => {
    await page.getByRole('button', { name: 'Show me how' }).click()
    await visible(page, 'Step 1 of 4')
    await visible(page, 'Tap the Share button')
  })
  await run.step('Step 2 shows “Add to Home Screen” in the share sheet', async () => {
    await next(page)
    await visible(page, 'Step 2 of 4')
    await page.getByRole('heading', { name: /Add to Home Screen/ }).waitFor()
  })
  await run.step('Step 3 shows the “Add” confirmation, with the trip’s name and icon', async () => {
    await next(page)
    await page.getByRole('heading', { name: 'Tap “Add”' }).waitFor()
    await visible(page, 'Lisbon Crew')
  })
  await run.step('Step 4 shows the trip sitting on the home screen', async () => {
    await next(page)
    await visible(page, 'Open it from your home screen')
  })
  await run.step('“Done” drops the guest into the trip', async () => {
    await page.getByRole('button', { name: 'Done' }).click()
    await visible(page, 'Day 2 of 3!')
    assert((await guide(page).count()) === 0, 'guide should be closed')
  })
  await run.step('It does not nag: reopening the link goes straight to the trip', async () => {
    await page.reload()
    await visible(page, 'Day 2 of 3!')
    assert((await guide(page).count()) === 0, 'guide should not reappear')
  })
  await run.step('The walkthrough stays one tap away at the bottom of Home', async () => {
    await page.getByRole('button', { name: /Add this trip to your home screen/ }).click()
    await guide(page).waitFor()
    await page.getByRole('button', { name: 'Not now' }).click()
  })
  return run.finish()
}

async function otherPhones(links) {
  const android = await createRun('phase4-b', { contextOptions: { userAgent: ANDROID } })
  android.story('Story 2 · Guest on Android')
  await android.step('Android gets Chrome’s steps: the ⋮ menu', async () => {
    await android.page.goto(links.guest)
    await android.page.getByRole('button', { name: 'Show me how' }).click()
    await visible(android.page, 'Tap the ⋮ menu')
  })
  await android.step('…then “Add to Home screen”, then “Install”', async () => {
    await next(android.page)
    await android.page.getByRole('heading', { name: /Add to Home screen/ }).waitFor()
    await next(android.page)
    await android.page.getByRole('heading', { name: 'Tap “Install”' }).waitFor()
  })
  const a = await android.finish()

  const insta = await createRun('phase4-c', { contextOptions: { userAgent: INSTAGRAM } })
  insta.story('Story 3 · Link opened inside Instagram')
  await insta.step('In-app browsers cannot install, so the guide says to open Safari first', async () => {
    await insta.page.goto(links.guest)
    await insta.page.getByRole('button', { name: 'Show me how' }).click()
    await visible(insta.page, 'First, open this in Safari')
  })
  const b = await insta.finish()
  return [a, b]
}

async function organiser(links) {
  const run = await createRun('phase4-d', { contextOptions: { userAgent: IPHONE } })
  const { page } = run
  let startUrl

  run.story('Story 4 · Organiser on their iPhone')
  await run.step('Opening the edit link shows the same walkthrough', async () => {
    await page.goto(links.edit)
    await guide(page).waitFor()
    await visible(page, 'Put Lisbon Crew on your home screen')
    await page.getByRole('button', { name: 'Not now' }).click()
  })
  await run.step('The Share tab keeps a “Show me how” for later', async () => {
    await page.getByText('On your home screen').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Show me how' }).click()
    await guide(page).waitFor()
    await page.getByRole('button', { name: 'Not now' }).click()
  })
  await run.step('The app an organiser installs remembers that they can edit', async () => {
    const href = await page.locator('link[rel="manifest"]').getAttribute('href')
    const manifest = await (await fetch(BASE_URL + href)).json()
    startUrl = manifest.start_url
    assert(manifest.name === 'Lisbon Crew', `manifest name was ${manifest.name}`)
    assert(startUrl === `/t/${links.id}?k=${links.token}`, `start_url was ${startUrl}`)
  })
  await run.step('A guest’s installed app carries no edit key', async () => {
    const forged = await (await fetch(`${BASE_URL}/api/manifest?id=${links.id}&k=made-up-key`)).json()
    assert(forged.start_url === `/t/${links.id}`, `start_url was ${forged.start_url}`)
  })
  const first = await run.finish()

  // The installed app: launched from the home screen with empty storage.
  const app = await createRun('phase4-e', { contextOptions: { userAgent: IPHONE } })
  await app.context.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }))
  app.story('Story 5 · Organiser opens the installed app')
  await app.step('It opens on the trip with no walkthrough, and an Edit button', async () => {
    await app.page.goto(BASE_URL + startUrl)
    await visible(app.page, 'Day 2 of 3!')
    assert((await guide(app.page).count()) === 0, 'installed app should not show the guide')
    await app.page.getByRole('link', { name: /Edit/ }).waitFor()
    assert(!app.page.url().includes('k='), 'edit key should be removed from the address')
  })
  await app.step('Edit opens the editor; “Open the guest view” goes back, all inside the app', async () => {
    await app.page.getByRole('link', { name: /Edit/ }).click()
    await app.page.getByRole('button', { name: 'Stay', exact: true }).waitFor()
    await app.page.getByRole('link', { name: 'Open the guest view' }).click()
    await visible(app.page, 'Day 2 of 3!')
  })
  return [first, await app.finish()]
}

;(async () => {
  const stop = await startServer()
  let failed = 1
  try {
    const links = await createViaApi()
    const runs = [await iphoneGuest(links), ...(await otherPhones(links)), ...(await organiser(links))]
    failed = runs.reduce((n, r) => n + r.failed, 0)
    joinVideos('phase4', runs.map((r) => r.mp4))
  } finally {
    stop()
  }
  process.exit(failed ? 1 : 0)
})()
