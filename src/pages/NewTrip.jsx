import { useState } from 'react'
import { DestinationField } from '../components/DestinationField'
import { Field, Link, Page, buttonPrimary, inputClass } from '../components/Page'
import { createTrip } from '../lib/api'
import { rememberMyTrip } from '../lib/localTrips'
import { navigate } from '../lib/router'
import { hasStarterPhrases } from '../../shared/phrasePacks'
import { CURRENCIES, LANGUAGES, suggestLocale } from '../../shared/tripSchema'

export default function NewTrip() {
  const [form, setForm] = useState({
    name: '',
    destination: '',
    emoji: '',
    start: '',
    end: '',
    homeCurrency: 'USD',
    localCurrency: 'EUR',
    languageCode: 'es-ES',
    passcode: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const applyLocale = (locale) => ({ localCurrency: locale.currency, languageCode: locale.language, emoji: locale.emoji })

  // Picking from the list sets flag, currency and language. Free typing does
  // too when it names a place we know; otherwise the flag is cleared and the
  // currency and language are left for the organiser to choose.
  function handleDestinationTyped(destination) {
    const guess = suggestLocale(destination)
    setForm((f) => ({ ...f, destination, ...(guess ? applyLocale(guess) : { emoji: '' }) }))
  }

  function handleDestinationPicked(match) {
    setForm((f) => ({ ...f, destination: match.label, ...applyLocale(match) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const { id, editToken, doc } = await createTrip(form)
      rememberMyTrip(id, doc.trip.name, editToken)
      navigate(`/t/${id}/edit#${editToken}`)
    } catch (err) {
      setError(
        err.status === 0 ? 'You appear to be offline.'
          : err.status === 503 ? 'This site has no database connected yet, so trips cannot be saved.'
            : err.message
      )
      setSaving(false)
    }
  }

  return (
    <Page>
      <Link to="/" className="text-teal text-sm font-medium">← Back</Link>
      <h1 className="font-display text-3xl font-bold text-charcoal mt-3">Create a trip</h1>
      <p className="text-charcoal/60 mt-1">Start with the basics. You can add the stay, schedule and places next.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <Field label="Trip name">
          <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Lisbon with the crew" maxLength={60} required />
        </Field>
        <DestinationField value={form.destination} onType={handleDestinationTyped} onPick={handleDestinationPicked} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="First day">
            <input type="date" className={inputClass} value={form.start} onChange={set('start')} required />
          </Field>
          <Field label="Last day">
            <input type="date" className={inputClass} value={form.end} min={form.start} onChange={set('end')} required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Your currency">
            <select className={inputClass} value={form.homeCurrency} onChange={set('homeCurrency')}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Local currency">
            <select className={inputClass} value={form.localCurrency} onChange={set('localCurrency')}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Local language" hint={hasStarterPhrases(form.languageCode) ? 'Your trip starts with a phrase book in this language.' : 'Used for the phrase book’s pronunciation.'}>
          <select className={inputClass} value={form.languageCode} onChange={set('languageCode')}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </Field>
        <Field label="Guest passcode (optional)" hint="If set, guests must enter it once to open the trip. Good if you will add a door code.">
          <input className={inputClass} value={form.passcode} onChange={set('passcode')} placeholder="e.g. sardine" maxLength={40} autoCapitalize="none" />
        </Field>

        {error && <p role="alert" className="text-terracotta text-sm font-medium">{error}</p>}

        <button type="submit" disabled={saving} className={buttonPrimary}>
          {saving ? 'Creating…' : 'Create trip'}
        </button>
      </form>
    </Page>
  )
}
