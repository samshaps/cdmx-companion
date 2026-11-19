import { createContext, useContext, useMemo } from 'react'
import { closestUiLanguage, isUiLanguage, translate } from '../../shared/i18n/index.js'

const LocaleContext = createContext('en')

// Sets the interface language for everything inside it. The landing and
// create pages use the visitor's own language; inside a trip, the language
// the organiser chose for that trip applies to organiser and guests alike.
export function LocaleProvider({ locale, children }) {
  return <LocaleContext.Provider value={isUiLanguage(locale) ? locale : 'en'}>{children}</LocaleContext.Provider>
}

// const t = useT(); t('Create a trip'); t('Step {n} of {total}', { n, total })
// t.locale is the active language code.
// eslint-disable-next-line react-refresh/only-export-components
export function useT() {
  const locale = useContext(LocaleContext)
  return useMemo(() => Object.assign((text, vars) => translate(locale, text, vars), { locale }), [locale])
}

const STORAGE_KEY = 'ui_language'

// The visitor's language: what they picked before, else what their browser asks for.
// eslint-disable-next-line react-refresh/only-export-components
export function detectLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isUiLanguage(stored)) return stored
  } catch { /* storage blocked */ }
  for (const tag of navigator.languages || [navigator.language]) {
    const match = closestUiLanguage(tag)
    if (match !== 'en' || String(tag).toLowerCase().startsWith('en')) return match
  }
  return 'en'
}

// eslint-disable-next-line react-refresh/only-export-components
export function rememberLocale(locale) {
  try { localStorage.setItem(STORAGE_KEY, locale) } catch { /* storage blocked */ }
}
