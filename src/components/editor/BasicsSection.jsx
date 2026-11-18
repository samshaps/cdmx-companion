import { useState } from 'react'
import { Card } from '../Card'
import { inputClass } from '../Page'
import { SelectField, TextField } from './fields'
import { CURRENCIES, LANGUAGES, reconcileItinerary } from '../../../shared/tripSchema'

export function BasicsSection({ doc, change, hasPasscode, onSetPasscode }) {
  const { trip } = doc
  const [passcode, setPasscode] = useState('')

  // Moving the dates reshapes the schedule, so warn before plans are dropped.
  function changeDates(start, end) {
    if (!start || !end || end < start) return
    const next = reconcileItinerary(doc.itinerary, start, end)
    const kept = new Set(next.map((d) => d.date))
    const losing = doc.itinerary.filter((d) => !kept.has(d.date) && d.events.length > 0)
    if (losing.length && !window.confirm(`This removes ${losing.length} day(s) that have events planned. Continue?`)) return
    change((d) => {
      d.trip.dates = { start, end }
      d.itinerary = next
    })
  }

  const languageOptions = LANGUAGES.map((l) => ({ value: l.code, label: l.name }))

  return (
    <div className="flex flex-col gap-4">
      <TextField label="Trip name" value={trip.name} onChange={(v) => change((d) => { d.trip.name = v })} maxLength={60} />
      <div className="grid grid-cols-[1fr_5rem] gap-3">
        <TextField label="Destination" value={trip.destination} onChange={(v) => change((d) => { d.trip.destination = v })} maxLength={80} />
        <TextField label="Emoji" value={trip.emoji} onChange={(v) => change((d) => { d.trip.emoji = v })} maxLength={8} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="First day" type="date" value={trip.dates.start} onChange={(v) => changeDates(v, trip.dates.end < v ? v : trip.dates.end)} />
        <TextField label="Last day" type="date" value={trip.dates.end} min={trip.dates.start} onChange={(v) => changeDates(trip.dates.start, v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Your currency" value={trip.currency.home} options={CURRENCIES} onChange={(v) => change((d) => { d.trip.currency.home = v })} />
        <SelectField label="Local currency" value={trip.currency.local} options={CURRENCIES} onChange={(v) => change((d) => { d.trip.currency.local = v })} />
      </div>
      <SelectField
        label="Local language"
        hint="Used for the phrase book’s pronunciation."
        value={trip.language.code}
        options={languageOptions}
        onChange={(v) => change((d) => { d.trip.language = { code: v, name: LANGUAGES.find((l) => l.code === v)?.name || '' } })}
      />

      <Card>
        <h3 className="font-bold text-charcoal">Guest passcode</h3>
        <p className="text-sm text-charcoal/60 mt-0.5">
          {hasPasscode
            ? 'On. Guests enter it once to open the trip.'
            : 'Off. Anyone with the guest link can open the trip.'}
        </p>
        <form
          className="flex gap-2 mt-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!passcode.trim()) return
            onSetPasscode(passcode.trim())
            setPasscode('')
          }}
        >
          <input
            className={inputClass}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder={hasPasscode ? 'New passcode' : 'Choose a passcode'}
            aria-label="New passcode"
            maxLength={40}
            autoCapitalize="none"
          />
          <button type="submit" className="text-terracotta font-bold px-2 whitespace-nowrap">Set</button>
        </form>
        {hasPasscode && (
          <button type="button" onClick={() => onSetPasscode('')} className="text-terracotta text-sm font-bold mt-2 min-h-[32px]">
            Remove passcode
          </button>
        )}
      </Card>
    </div>
  )
}
