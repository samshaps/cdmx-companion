// Collects every English string the app can show, so translations can be
// checked for completeness. Run directly to print them as JSON:
//   node scripts/i18n-keys.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DAY_SLOTS } from '../shared/tripSchema.js'
import { STARTER_PHRASES } from '../shared/phrasePacks.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function files(dir) {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name)
    if (entry.isDirectory()) return rel === path.join('shared', 'i18n') ? [] : files(rel)
    return /\.(js|jsx)$/.test(entry.name) ? [rel] : []
  })
}

// A quoted JavaScript string literal, either quote style, with escapes.
const LITERAL = String.raw`'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"`
const PATTERNS = [
  new RegExp(String.raw`\bt\(\s*(?:${LITERAL})`, 'g'), // t('…')
  new RegExp(String.raw`\btx\(\s*(?:${LITERAL})`, 'g'), // tx('…') marks text translated where rendered
  new RegExp(String.raw`\btranslate\(\s*\w+,\s*(?:${LITERAL})`, 'g'), // translate(locale, '…')
  // Messages the server sends back for display.
  new RegExp(String.raw`\bnew (?:TripValidationError|PreviewError)\(\s*(?:${LITERAL})`, 'g'),
  new RegExp(String.raw`\bjson\(\s*4\d\d,\s*\{\s*error:\s*(?:${LITERAL})`, 'g'),
]
const unescape = (raw) => raw.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n')
const capitalise = (word) => word.charAt(0).toUpperCase() + word.slice(1)

export function collectKeys() {
  const keys = new Set()
  for (const file of [...files('src'), ...files('shared'), ...files('server')]) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8')
    for (const pattern of PATTERNS) {
      for (const match of source.matchAll(pattern)) {
        const text = unescape(match[1] ?? match[2])
        // Sentences only: machine codes like "not_found" are not shown to people.
        if (/[A-Za-z]/.test(text) && !/^[a-z_]+$/.test(text)) keys.add(text)
      }
    }
  }
  // Text that reaches t() through data rather than a literal.
  for (const slot of DAY_SLOTS) keys.add(slot.label)
  for (const [category] of STARTER_PHRASES) keys.add(capitalise(category))
  keys.add('Greetings')
  keys.add('basics') // the default phrase-group name, shown as a placeholder
  return [...keys].sort()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.stdout.write(JSON.stringify(collectKeys(), null, 2) + '\n')
}
