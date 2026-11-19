import { useState } from 'react'
import { TripShell } from '../components/TripShell'
import { Field, Link, Page, buttonPrimary, inputClass } from '../components/Page'
import { useRemoteTrip } from '../hooks/useRemoteTrip'
import { LocaleProvider, useT } from '../i18n/LocaleContext'
import { getEditToken } from '../lib/localTrips'

function Message({ emoji, title, children }) {
  const t = useT()
  return (
    <Page>
      <div className="text-center mt-16">
        <div className="text-5xl">{emoji}</div>
        <h1 className="font-display text-2xl font-bold text-charcoal mt-4">{title}</h1>
        <div className="text-charcoal/70 mt-2">{children}</div>
        <Link to="/" className="inline-block mt-6 text-teal font-bold">{t('Go to the home page')}</Link>
      </div>
    </Page>
  )
}

function PasscodeGate({ trip, wrong, onSubmit }) {
  const t = useT()
  const [passcode, setPasscode] = useState('')
  return (
    <Page>
      <form
        className="text-center mt-16"
        onSubmit={(e) => {
          e.preventDefault()
          if (passcode.trim()) onSubmit(passcode.trim())
        }}
      >
        <div className="text-5xl">{trip?.emoji || '🔑'}</div>
        <h1 className="font-display text-2xl font-bold text-charcoal mt-4">{trip?.name || t('This trip')}</h1>
        <p className="text-charcoal/70 mt-2 mb-6">{t('Enter the passcode from your trip organizer.')}</p>
        <Field label={t('Passcode')}>
          <input className={inputClass} value={passcode} onChange={(e) => setPasscode(e.target.value)} autoCapitalize="none" autoFocus />
        </Field>
        {wrong && <p role="alert" className="text-terracotta text-sm font-medium mt-2">{t('That passcode is not right. Try again.')}</p>}
        <button type="submit" className={`${buttonPrimary} mt-4`}>{t('Open trip')}</button>
      </form>
    </Page>
  )
}

export default function GuestTrip({ id }) {
  const t = useT()
  const trip = useRemoteTrip(id)

  if (trip.status === 'loading') return <Page><p className="text-center text-charcoal/50 mt-20">{t('Loading trip…')}</p></Page>
  if (trip.status === 'passcode') return <PasscodeGate trip={trip.lockedTrip} wrong={trip.wrong} onSubmit={trip.submitPasscode} />
  if (trip.status === 'notfound') {
    return <Message emoji="🧭" title={t('Trip not found')}>{t('Check the link, or ask your organizer for a new one. Trips are deleted 30 days after they end.')}</Message>
  }
  if (trip.status === 'error') {
    return <Message emoji="📡" title={t('Can’t load the trip')}>{trip.message ? t(trip.message) : t('Connect to the internet and open the link again. After the first load it works offline.')}</Message>
  }
  return (
    <LocaleProvider locale={trip.data.trip.locale}>
      <TripShell
        data={trip.data}
        installable
        editHref={getEditToken(id) ? `/t/${id}/edit` : null}
        banner={trip.offline ? t('Offline · showing the copy saved on this phone') : null}
      />
    </LocaleProvider>
  )
}
