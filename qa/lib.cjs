// Tiny harness for scripted, recorded happy-path QA runs.
// Each run produces qa/output/<name>.mp4 (captioned screen recording of a
// phone-sized browser) and qa/output/<name>.md (pass/fail checklist).
const { chromium } = require('playwright')
const { spawn, execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(__dirname, 'output')
const PORT = 5199
const BASE_URL = `http://localhost:${PORT}`
const VIEWPORT = { width: 390, height: 844 }
const BAND = 230 // caption band height in video pixels
const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
const FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function startServer() {
  const proc = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
    detached: true,
  })
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE_URL)
      if (res.ok) return () => process.kill(-proc.pid)
    } catch { /* not up yet */ }
    await sleep(250)
  }
  process.kill(-proc.pid)
  throw new Error('dev server did not start')
}

function wrap(text, width) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > width) {
      lines.push(line)
      line = word
    } else {
      line = (line + ' ' + word).trim()
    }
  }
  if (line) lines.push(line)
  return lines.join('\n')
}

async function createRun(name, { contextOptions = {} } = {}) {
  fs.mkdirSync(OUT, { recursive: true })
  const rawDir = fs.mkdtempSync(path.join(OUT, `.raw-${name}-`))
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: rawDir, size: VIEWPORT },
    ...contextOptions,
  })
  // Show a ripple wherever the script taps, so the recording is followable.
  await context.addInitScript(() => {
    window.addEventListener('pointerdown', (e) => {
      const dot = document.createElement('div')
      dot.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(232,168,56,.55);border:2px solid #C2572B;z-index:99999;pointer-events:none;transition:all .5s ease-out`
      document.documentElement.appendChild(dot)
      requestAnimationFrame(() => { dot.style.transform = 'scale(1.6)'; dot.style.opacity = '0' })
      setTimeout(() => dot.remove(), 600)
    }, true)
  })
  const page = await context.newPage()
  const t0 = Date.now()
  const captions = [] // { story, text, start, end }
  const results = [] // { story, text, ok, error }
  let currentStory = ''

  const run = {
    page,
    context,
    story(title) {
      currentStory = title
      console.log(`\n${title}`)
    },
    // A step is one caption on screen + one line in the checklist. `fn` both
    // performs the action and asserts the outcome; throwing marks it failed.
    async step(text, fn) {
      const caption = { story: currentStory, text, start: (Date.now() - t0) / 1000 }
      captions.push(caption)
      await sleep(700)
      try {
        await fn(page)
        results.push({ story: currentStory, text, ok: true })
        console.log(`  ✓ ${text}`)
      } catch (error) {
        results.push({ story: currentStory, text, ok: false, error: String(error.message).split('\n')[0] })
        console.log(`  ✗ ${text}\n    ${error.message.split('\n')[0]}`)
      }
      await sleep(1300)
      caption.end = (Date.now() - t0) / 1000
    },
    async finish() {
      const video = page.video()
      await context.close()
      await browser.close()
      const raw = await video.path()
      const mp4 = path.join(OUT, `${name}.mp4`)
      // Playwright records at CSS-pixel size; upscale 2x so it is legible on a phone.
      const filters = ['scale=iw*2:ih*2:flags=lanczos', `pad=iw:ih+${BAND}:0:${BAND}:color=0x1A535C`]
      captions.forEach((c, i) => {
        const ok = results[i].ok
        const storyFile = path.join(rawDir, `s${i}.txt`)
        const stepFile = path.join(rawDir, `c${i}.txt`)
        fs.writeFileSync(storyFile, c.story)
        fs.writeFileSync(stepFile, wrap(`${ok ? 'PASS' : 'FAIL'}  ${c.text}`, 40))
        const window = `enable='between(t,${c.start.toFixed(2)},${c.end.toFixed(2)})'`
        filters.push(`drawtext=fontfile=${FONT_BOLD}:textfile=${storyFile}:fontsize=30:fontcolor=0xE8A838:x=28:y=26:${window}`)
        filters.push(`drawtext=fontfile=${FONT}:textfile=${stepFile}:fontsize=32:line_spacing=10:fontcolor=${ok ? 'white' : '0xFF8A80'}:x=28:y=84:${window}`)
      })
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', filters.join(','), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4])
      fs.rmSync(rawDir, { recursive: true, force: true })

      const failed = results.filter((r) => !r.ok)
      const lines = [`# QA run: ${name}`, '', `${results.length - failed.length}/${results.length} steps passed`, '']
      let story = null
      for (const r of results) {
        if (r.story !== story) { story = r.story; lines.push('', `## ${story}`, '') }
        lines.push(`- [${r.ok ? 'x' : ' '}] ${r.text}${r.ok ? '' : ` — **FAILED:** ${r.error}`}`)
      }
      fs.writeFileSync(path.join(OUT, `${name}.md`), lines.join('\n') + '\n')
      console.log(`\n${results.length - failed.length}/${results.length} steps passed → ${path.relative(ROOT, mp4)}`)
      return { mp4, failed: failed.length }
    },
  }
  return run
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

module.exports = { startServer, createRun, assert, sleep, BASE_URL, ROOT }
