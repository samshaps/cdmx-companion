import { useState } from 'react'
import { DestinationField } from '../components/DestinationField'
import { Field, Link, Page, buttonPrimary, inputClass } from '../components/Page'
import { SkinToast } from '../components/SkinToast'
import { useSkin } from '../hooks/useSkin'
import { useT } from '../i18n/LocaleContext'
import { createTrip } from '../lib/api'
import { rememberMyTrip } from '../lib/localTrips'
import { navigate } from '../lib/router'
import { hasStarterPhrases } from '../../shared/phrasePacks'
import { CURRENCIES, LANGUAGES, suggestLocale } from '../../shared/tripSchema'

export default function NewTrip() {
  const t = useT()
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
    skin: null,
  })
  // The recognized place whose colors are on offer, and the one (if any)
  // the organizer has already said no to.
  const [offer, setOffer] = useState(null)
  const [declined, setDeclined] = useState('')
  const [greeted, setGreeted] = useState('')
  useSkin(form.skin)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const applyLocale = (locale) => ({ localCurrency: locale.currency, languageCode: locale.language, emoji: locale.emoji })

  // Picking from the list sets flag, currency and language. Free typing does
  // too when it names a place we know; otherwise the flag is cleared and the
  // currency and language are left for the organizer to choose.
  // A newly recognized place also puts the trip in its flag's colors and
  // says hello; a place the organizer already declined is left alone.
  function recognize(destination, match) {
    const wear = match && match.place !== declined
    setForm((f) => ({
      ...f,
      destination,
      ...(match ? applyLocale(match) : { emoji: '' }),
      skin: wear ? match.skin : null,
    }))
    if (wear && match.place !== greeted) {
      setOffer(match)
      setGreeted(match.place)
    }
    if (!match) setOffer(null)
  }

  const handleDestinationTyped = (destination) => recognize(destination, suggestLocale(destination))
  const handleDestinationPicked = (match) => recognize(match.label, match)

  function revertSkin() {
    setDeclined(offer.place)
    setOffer(null)
    setForm((f) => ({ ...f, skin: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const { id, editToken, doc } = await createTrip({ ...form, locale: t.locale })
      rememberMyTrip(id, doc.trip.name, editToken)
      navigate(`/t/${id}/edit#${editToken}`)
    } catch (err) {
      setError(
        err.status === 0 ? t('You appear to be offline.')
          : err.status === 503 ? t('This site has no database connected yet, so trips cannot be saved.')
            : t(err.message)
      )
      setSaving(false)
    }
  }

  return (
    <Page>
      <Link to="/" className="text-teal text-sm font-medium">← {t('Back')}</Link>
      <h1 className="font-display text-3xl font-bold text-charcoal mt-3">{t('Create a trip')}</h1>
      <p className="text-charcoal/60 mt-1">{t('Start with the basics. You can add the stay, schedule and places next.')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <Field label={t('Trip name')}>
          <input className={inputClass} value={form.name} onChange={set('name')} placeholder={t('Lisbon with the crew')} maxLength={60} required />
        </Field>
        <DestinationField value={form.destination} onType={handleDestinationTyped} onPick={handleDestinationPicked} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('First day')}>
            <input type="date" className={inputClass} value={form.start} onChange={set('start')} required />
          </Field>
          <Field label={t('Last day')}>
            <input type="date" className={inputClass} value={form.end} min={form.start} onChange={set('end')} required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('Your currency')}>
            <select className={inputClass} value={form.homeCurrency} onChange={set('homeCurrency')}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={t('Local currency')}>
            <select className={inputClass} value={form.localCurrency} onChange={set('localCurrency')}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label={t('Local language')} hint={hasStarterPhrases(form.languageCode) ? t('Your trip starts with a phrase book in this language.') : t('Used for the phrase book’s pronunciation.')}>
          <select className={inputClass} value={form.languageCode} onChange={set('languageCode')}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </Field>
        <Field label={t('Guest passcode (optional)')} hint={t('If set, guests must enter it once to open the trip. Good if you will add a door code.')}>
          <input className={inputClass} value={form.passcode} onChange={set('passcode')} placeholder={t('e.g. sardine')} maxLength={40} autoCapitalize="none" />
        </Field>

        {error && <p role="alert" className="text-terracotta text-sm font-medium">{error}</p>}

        <button type="submit" disabled={saving} className={buttonPrimary}>
          {saving ? t('Creating…') : t('Create trip')}
        </button>
      </form>
      {offer && form.skin && (
        <SkinToast hello={offer.hello} emoji={offer.emoji} place={offer.place} onKeep={() => setOffer(null)} onRevert={revertSkin} />
      )}
    </Page>
  )
}
