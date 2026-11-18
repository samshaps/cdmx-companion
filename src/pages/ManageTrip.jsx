import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Link, Page, buttonPrimary } from '../components/Page'
import { fetchTrip } from '../lib/api'
import { forgetMyTrip, getEditToken, rememberMyTrip } from '../lib/localTrips'
import { editUrl, guestUrl } from '../lib/router'
import { copyToClipboard } from '../utils/clipboard'

function ShareLink({ label, description, url, testId }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (await copyToClipboard(url)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card>
      <h3 className="font-bold text-charcoal">{label}</h3>
      <p className="text-sm text-charcoal/60 mt-0.5">{description}</p>
      <p data-testid={testId} className="font-mono text-xs text-teal bg-white rounded-lg px-3 py-2 mt-3 break-all">{url}</p>
      <button onClick={handleCopy} className="mt-2 min-h-[44px] text-terracotta font-bold">
        {copied ? 'Copied!' : `Copy ${label.toLowerCase()}`}
      </button>
    </Card>
  )
}

// The organiser's page for one trip. Reached through the private edit link;
// the token in the #hash (or remembered on this device) proves they may edit.
export default function ManageTrip({ id }) {
  const [token] = useState(() => window.location.hash.slice(1) || getEditToken(id))
  const [state, setState] = useState({ status: token ? 'loading' : 'denied' })

  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetchTrip(id, { token })
      .then(({ doc, hasPasscode }) => {
        if (cancelled) return
        rememberMyTrip(id, doc.trip.name, token)
        setState({ status: 'ready', doc, hasPasscode })
      })
      .catch((error) => {
        if (cancelled) return
        if (error.status === 404) forgetMyTrip(id)
        setState({ status: error.status === 403 ? 'denied' : error.status === 404 ? 'notfound' : 'error' })
      })
    return () => { cancelled = true }
  }, [id, token])

  if (state.status === 'loading') return <Page><p className="text-center text-charcoal/50 mt-20">Loading…</p></Page>

  if (state.status !== 'ready') {
    const message = {
      denied: 'This page needs the private edit link you were given when the trip was created.',
      notfound: 'This trip no longer exists. Trips are deleted 30 days after they end.',
      error: 'Could not reach the server. Check your connection and try again.',
    }[state.status]
    return (
      <Page>
        <div className="text-center mt-16">
          <div className="text-5xl">🔒</div>
          <h1 className="font-display text-2xl font-bold text-charcoal mt-4">Can’t open the organiser page</h1>
          <p className="text-charcoal/70 mt-2">{message}</p>
          <Link to="/" className="inline-block mt-6 text-teal font-bold">Go to the home page</Link>
        </div>
      </Page>
    )
  }

  const { trip } = state.doc
  return (
    <Page>
      <Link to="/" className="text-teal text-sm font-medium">← All trips</Link>
      <h1 className="font-display text-3xl font-bold text-charcoal mt-3">
        {trip.emoji} {trip.name}
      </h1>
      <p className="text-charcoal/60 mt-1">
        {trip.destination} · {trip.dates.start} to {trip.dates.end}
        {state.hasPasscode && ' · passcode on'}
      </p>

      <h2 className="font-display text-lg font-bold text-charcoal mt-8 mb-3">Share</h2>
      <div className="flex flex-col gap-3">
        <ShareLink
          label="Guest link"
          description="Send this to everyone on the trip. They open it and add it to their home screen."
          url={guestUrl(id)}
          testId="guest-link"
        />
        <ShareLink
          label="Edit link"
          description="Keep this private. Anyone with it can change the trip. It is the only way back to this page from another device."
          url={editUrl(id, token)}
          testId="edit-link"
        />
      </div>

      <a href={guestUrl(id)} target="_blank" rel="noopener noreferrer" className={`${buttonPrimary} mt-6`}>
        Open the guest view
      </a>
    </Page>
  )
}
