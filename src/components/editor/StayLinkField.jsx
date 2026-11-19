import { useState } from 'react'
import { inputClass } from '../Page'
import { previewStayLink } from '../../lib/api'
import { useT } from '../../i18n/LocaleContext'

const tx = (s) => s // marks text for translation; translated where rendered

const LABELS = { name: tx('name'), photo: tx('photo'), address: tx('address'), pin: tx('map pin'), checkIn: tx('check-in time'), checkOut: tx('check-out time') }

// "Paste your Airbnb, Vrbo or hotel link": asks the server to read the
// listing page and fills in whatever it publishes. Says plainly what it
// found and what still needs typing.
export function StayLinkField({ id, token, onFound }) {
  const t = useT()
  const [url, setUrl] = useState('')
  const [state, setState] = useState({ status: 'idle' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return
    setState({ status: 'loading' })
    try {
      const { stay } = await previewStayLink(id, token, url.trim())
      const found = {
        name: stay.name,
        photo: stay.photo,
        address: stay.address,
        pin: stay.lat != null,
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
      }
      onFound(stay)
      setState({
        status: 'done',
        got: Object.keys(LABELS).filter((key) => found[key]).map((key) => LABELS[key]),
        needsAddress: !stay.address,
        area: stay.area,
      })
    } catch (error) {
      setState({
        status: 'error',
        message: error.status === 0 ? tx('You appear to be offline.') : error.status === 422 || error.status === 429 || error.status === 400 ? error.message : tx('Something went wrong reading that link.'),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-warm-gray rounded-card shadow-card p-4">
      <label className="block">
        <span className="block text-sm font-bold text-charcoal mb-1">{t('Have a link to the place?')}</span>
        <span className="block text-sm text-charcoal/60 mb-2">{t('Paste your Airbnb, Vrbo or hotel page and we will fill in what we can.')}</span>
        <input
          className={inputClass}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.airbnb.com/rooms/…"
          aria-label={t('Link to the place')}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
        />
      </label>
      <button type="submit" disabled={state.status === 'loading' || !url.trim()} className="min-h-[44px] text-terracotta font-bold disabled:opacity-40">
        {state.status === 'loading' ? t('Reading the page…') : t('Fill in from link')}
      </button>
      {state.status === 'done' && (
        <p role="status" className="text-sm text-charcoal/80">
          {t('✓ Filled in the {list}.', { list: state.got.map((label) => t(label)).join(', ') })}
          {state.needsAddress && ' ' + (state.area
            ? t('Listings do not publish the exact address (only “{area}”), so paste that below from your booking confirmation.', { area: state.area })
            : t('Listings do not publish the exact address, so paste that below from your booking confirmation.'))}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="text-sm text-terracotta font-medium">
          {t(state.message)} {t('You can still type the details in below.')}
        </p>
      )}
    </form>
  )
}
