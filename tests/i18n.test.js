import assert from 'node:assert/strict'
import { test } from 'node:test'
import { collectKeys } from '../scripts/i18n-keys.mjs'
import { closestUiLanguage, translate, UI_LANGUAGES } from '../shared/i18n/index.js'

const keys = collectKeys()
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

for (const { code, name } of UI_LANGUAGES.filter((l) => l.code !== 'en')) {
  test(`${name}: every string in the app is translated`, async () => {
    const catalogue = (await import(`../shared/i18n/${code}.js`)).default
    const missing = keys.filter((key) => !catalogue[key])
    assert.deepEqual(missing, [], `${missing.length} untranslated`)
  })

  test(`${name}: translations keep their {placeholders}`, async () => {
    const catalogue = (await import(`../shared/i18n/${code}.js`)).default
    for (const [key, value] of Object.entries(catalogue)) {
      assert.deepEqual(placeholders(value), placeholders(key), key)
    }
  })
}

test('lookup falls back to English and fills placeholders', () => {
  assert.equal(translate('en', 'Day {n}', { n: 3 }), 'Day 3')
  assert.equal(translate('xx', 'Create a trip'), 'Create a trip')
  assert.equal(translate('fr', 'A sentence nobody translated'), 'A sentence nobody translated')
  assert.equal(closestUiLanguage('pt-BR'), 'pt')
  assert.equal(closestUiLanguage('ja-JP'), 'en')
})
