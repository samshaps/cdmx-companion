// Interface languages. The English text in the code is the key: t('Create a
// trip') looks that sentence up in the chosen language's catalogue and falls
// back to the English itself, so a missing translation is never a blank.
import de from './de.js'
import es from './es.js'
import fr from './fr.js'
import pt from './pt.js'

const CATALOGUES = { de, es, fr, pt }

export const UI_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
]

const CODES = UI_LANGUAGES.map((l) => l.code)

export const isUiLanguage = (code) => CODES.includes(code)

// "fr-CA" → "fr"; anything unsupported → "en".
export function closestUiLanguage(tag) {
  const base = String(tag || '').toLowerCase().split('-')[0]
  return CODES.includes(base) ? base : 'en'
}

// {name} placeholders are filled from `vars`.
export function translate(locale, text, vars) {
  const template = CATALOGUES[locale]?.[text] ?? text
  return vars ? template.replace(/\{(\w+)\}/g, (whole, key) => (key in vars ? String(vars[key]) : whole)) : template
}

// For Date#toLocaleDateString and friends. English stays US-style, as before.
export const dateLocale = (locale) => (locale && locale !== 'en' ? locale : 'en-US')

// Americans think in miles; everyone else here in kilometres.
export const usesMiles = (locale) => !locale || locale === 'en'
