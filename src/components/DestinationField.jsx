import { useState } from 'react'
import { Field, inputClass } from './Page'
import { useT } from '../i18n/LocaleContext'
import { searchDestinations } from '../../shared/destinations'

// A type-ahead for the destination. The list narrows as you type; picking a
// place fills in its flag, currency and language. Anything can still be typed
// freely: a place we do not know is used exactly as written.
export function DestinationField({ value, onType, onPick }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const matches = searchDestinations(value)
  const typed = value.trim()
  const exact = matches.some((m) => m.label.toLowerCase() === typed.toLowerCase())
  const showList = open && typed.length > 0

  function pick(match) {
    onPick(match)
    setOpen(false)
  }

  function handleKeyDown(e) {
    if (!showList) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && matches[active]) {
      e.preventDefault()
      pick(matches[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Field label={t('Destination')}>
        <input
          className={inputClass}
          value={value}
          onChange={(e) => {
            onType(e.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => setOpen(true)}
          // Delay so a tap on an option lands before the list closes.
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={t('Start typing a city or country')}
          maxLength={80}
          required
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls="destination-options"
        />
      </Field>
      {showList && (
        <ul id="destination-options" role="listbox" className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-lg shadow-card border border-charcoal/10 overflow-hidden">
          {matches.map((match, i) => (
            <li key={match.label} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(match)}
                className={`w-full text-left px-3 min-h-[44px] flex items-center gap-2 text-charcoal ${i === active ? 'bg-warm-gray' : ''}`}
              >
                <span className="text-lg">{match.emoji}</span>
                <span>{match.label}</span>
              </button>
            </li>
          ))}
          {!exact && (
            <li role="option" aria-selected="false">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 min-h-[44px] flex items-center gap-2 text-charcoal/70 border-t border-charcoal/10"
              >
                <span className="text-lg">✏️</span>
                <span>{matches.length === 0 ? t('Use “{typed}” and set currency and language below', { typed }) : t('Use “{typed}”', { typed })}</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
