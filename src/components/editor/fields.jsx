import { useState } from 'react'
import { Field, inputClass } from '../Page'
import { parseCoordinates } from '../../utils/coordinates'
import { useT } from '../../i18n/LocaleContext'

export function TextField({ label, hint, value, onChange, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputClass} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  )
}

export function TextArea({ label, hint, value, onChange, rows = 3, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        className={`${inputClass} py-2 leading-snug`}
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </Field>
  )
}

export function SelectField({ label, hint, value, onChange, options }) {
  return (
    <Field label={label} hint={hint}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </Field>
  )
}

// Coordinates power the Uber button and "sorted by distance". Organizers
// paste a maps link rather than typing numbers.
export function LocationField({ lat, lng, onChange }) {
  const t = useT()
  const [text, setText] = useState('')
  const [failed, setFailed] = useState(false)
  const hasPin = lat != null && lng != null

  function handleChange(value) {
    setText(value)
    const found = parseCoordinates(value)
    setFailed(Boolean(value.trim()) && !found)
    if (found) onChange(found)
  }

  return (
    <Field
      label={t('Map pin (optional)')}
      hint={
        failed ? t('No coordinates found in that. Open the place in Google Maps on a computer and copy the address bar.')
          : hasPin ? t('📍 Pinned at {lat}, {lng}', { lat: lat.toFixed(4), lng: lng.toFixed(4) })
            : t('Paste a Google Maps link or "lat, lng". Enables Uber and distance sorting.')
      }
    >
      <div className="flex gap-2">
        <input className={inputClass} value={text} onChange={(e) => handleChange(e.target.value)} placeholder={t('Paste a maps link')} aria-label={t('Map pin')} />
        {hasPin && (
          <button type="button" onClick={() => { setText(''); onChange({ lat: null, lng: null }) }} className="text-terracotta text-sm font-bold px-2">
            {t('Clear')}
          </button>
        )}
      </div>
    </Field>
  )
}

export function ItemCard({ title, onRemove, children }) {
  const t = useT()
  return (
    <div className="bg-warm-gray rounded-card shadow-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-charcoal/50">{title}</span>
        <button type="button" onClick={onRemove} className="text-terracotta text-sm font-bold min-h-[32px]">{t('Remove')}</button>
      </div>
      {children}
    </div>
  )
}

export function AddButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[48px] border-2 border-dashed border-teal/50 text-teal font-bold rounded-card active:scale-[0.98] transition-transform"
    >
      + {children}
    </button>
  )
}
