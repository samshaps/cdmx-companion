import { useEffect, useRef, useState } from 'react'
import { InstallGuide } from '../components/InstallGuide'
import { Link, Page } from '../components/Page'
import { BasicsSection } from '../components/editor/BasicsSection'
import { PhrasesSection } from '../components/editor/PhrasesSection'
import { PlacesSection } from '../components/editor/PlacesSection'
import { ScheduleSection } from '../components/editor/ScheduleSection'
import { ShareSection } from '../components/editor/ShareSection'
import { StaySection } from '../components/editor/StaySection'
import { fetchTrip, saveTrip } from '../lib/api'
import { forgetMyTrip, getEditToken, rememberMyTrip } from '../lib/localTrips'
import { dismissInstallGuide, shouldAutoShowInstallGuide } from '../utils/platform'

const SECTIONS = ['Share', 'Basics', 'Stay', 'Schedule', 'Places', 'Phrases']
const SAVE_DELAY_MS = 800

const SAVE_LABEL = {
  saved: '✓ All changes saved',
  dirty: 'Saving…',
  saving: 'Saving…',
}

// The organiser's page for one trip. Reached through the private edit link;
// the token in the #hash (or remembered on this device) proves they may edit.
// Every change is saved automatically a moment after typing stops.
export default function ManageTrip({ id }) {
  const [token] = useState(() => window.location.hash.slice(1) || getEditToken(id))
  const [status, setStatus] = useState(token ? 'loading' : 'denied')
  const [doc, setDoc] = useState(null)
  const [hasPasscode, setHasPasscode] = useState(false)
  const [section, setSection] = useState('Share')
  const [save, setSave] = useState({ state: 'saved', error: '' })
  const [installOpen, setInstallOpen] = useState(shouldAutoShowInstallGuide)
  const latest = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetchTrip(id, { token })
      .then((res) => {
        if (cancelled) return
        rememberMyTrip(id, res.doc.trip.name, token)
        latest.current = res.doc
        setDoc(res.doc)
        setHasPasscode(res.hasPasscode)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        if (error.status === 404) forgetMyTrip(id)
        setStatus(error.status === 403 ? 'denied' : error.status === 404 ? 'notfound' : 'error')
      })
    return () => {
      cancelled = true
      clearTimeout(timer.current)
    }
  }, [id, token])

  async function flush(passcode) {
    clearTimeout(timer.current)
    const sending = latest.current
    setSave({ state: 'saving', error: '' })
    try {
      const res = await saveTrip(id, token, sending, passcode)
      setHasPasscode(res.hasPasscode)
      rememberMyTrip(id, res.doc.trip.name, token)
      // Only report "saved" if nothing changed while the request was in flight.
      if (latest.current === sending) setSave({ state: 'saved', error: '' })
    } catch (error) {
      setSave({
        state: 'error',
        error: error.status === 0 ? 'You are offline. Changes will save when you edit again online.' : error.message,
      })
    }
  }

  // Sections describe an edit as a mutation of a draft copy of the trip.
  function change(mutate) {
    const next = structuredClone(latest.current)
    mutate(next)
    latest.current = next
    setDoc(next)
    setSave({ state: 'dirty', error: '' })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => flush(), SAVE_DELAY_MS)
  }

  function replaceDoc(imported) {
    latest.current = imported
    setDoc(imported)
    flush().then(() => fetchTrip(id, { token })).then((res) => {
      // Show the cleaned-up version the server actually stored.
      latest.current = res.doc
      setDoc(res.doc)
    }).catch(() => {})
  }

  if (status === 'loading') return <Page><p className="text-center text-charcoal/50 mt-20">Loading…</p></Page>

  if (status !== 'ready') {
    const message = {
      denied: 'This page needs the private edit link you were given when the trip was created.',
      notfound: 'This trip no longer exists. Trips are deleted 30 days after they end.',
      error: 'Could not reach the server. Check your connection and try again.',
    }[status]
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

  const { trip } = doc
  return (
    <Page>
      {installOpen && (
        <InstallGuide
          name={trip.name}
          emoji={trip.emoji}
          onClose={() => {
            dismissInstallGuide()
            setInstallOpen(false)
          }}
        />
      )}
      <Link to="/" className="text-teal text-sm font-medium">← All trips</Link>
      <h1 className="font-display text-3xl font-bold text-charcoal mt-3">
        {trip.emoji} {trip.name || 'Untitled trip'}
      </h1>
      <p className="text-charcoal/60 mt-1">
        {trip.destination} · {trip.dates.start} to {trip.dates.end}
        {hasPasscode && ' · passcode on'}
      </p>

      <div className="sticky top-0 z-10 bg-cream pt-3 pb-2 -mx-5 px-5 mt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map((name) => (
            <button
              key={name}
              onClick={() => setSection(name)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap min-h-[44px] transition-colors ${
                section === name ? 'bg-teal text-white' : 'border border-teal text-teal'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <p
          role="status"
          className={`text-xs mt-2 ${save.state === 'error' ? 'text-terracotta font-bold' : 'text-charcoal/50'}`}
        >
          {save.state === 'error' ? `Not saved: ${save.error}` : SAVE_LABEL[save.state]}
        </p>
      </div>

      <div className="mt-4 pb-16">
        {section === 'Share' && <ShareSection id={id} token={token} doc={doc} onImport={replaceDoc} onShowInstall={() => setInstallOpen(true)} />}
        {section === 'Basics' && <BasicsSection doc={doc} change={change} hasPasscode={hasPasscode} onSetPasscode={(p) => flush(p)} />}
        {section === 'Stay' && <StaySection doc={doc} change={change} />}
        {section === 'Schedule' && <ScheduleSection doc={doc} change={change} />}
        {section === 'Places' && <PlacesSection doc={doc} change={change} />}
        {section === 'Phrases' && <PhrasesSection doc={doc} change={change} />}
      </div>
    </Page>
  )
}
