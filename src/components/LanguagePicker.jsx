import { UI_LANGUAGES } from '../../shared/i18n/index.js'
import { useT } from '../i18n/LocaleContext'

// Sits in the bottom-right corner of the landing page showing the language
// we assumed from the browser, and lets the visitor change it.
export function LanguagePicker({ locale, onChange }) {
  const t = useT()
  return (
    <label className="fixed bottom-3 right-3 z-30 flex items-center gap-1 bg-white/90 rounded-full shadow-card border border-charcoal/10 pl-3 pr-1 text-sm text-charcoal">
      <span aria-hidden="true">🌐</span>
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('Language')}
        className="bg-transparent min-h-[40px] pr-1 outline-none font-medium"
      >
        {UI_LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
      </select>
    </label>
  )
}
