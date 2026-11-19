import { useState } from 'react'
import { editUrl, guestUrl } from '../../lib/router'
import { copyToClipboard } from '../../utils/clipboard'

function ShareOption({ emoji, title, who, explainer, url, testId, tone }) {
  const [copied, setCopied] = useState(false)
  const canSend = typeof navigator.share === 'function'

  async function handleCopy() {
    if (await copyToClipboard(url)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`rounded-card p-4 ${tone}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div className="min-w-0">
          <h3 className="font-bold text-charcoal">{title}</h3>
          <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">{who}</p>
          <p className="text-sm text-charcoal/70 mt-1">{explainer}</p>
        </div>
      </div>
      <p data-testid={testId} className="font-mono text-xs text-teal bg-white rounded-lg px-3 py-2 mt-3 break-all">{url}</p>
      <div className="flex gap-4 mt-1">
        <button onClick={handleCopy} className="min-h-[44px] text-terracotta font-bold">
          {copied ? 'Copied!' : `Copy ${title.toLowerCase()}`}
        </button>
        {canSend && (
          <button onClick={() => navigator.share({ url }).catch(() => {})} className="min-h-[44px] text-terracotta font-bold">
            Send…
          </button>
        )}
      </div>
    </div>
  )
}

// Opened from the Share button that sits at the bottom of every editor page.
export function ShareSheet({ id, token, hasPasscode, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-label="Share this trip">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-charcoal/50" />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-cream rounded-t-3xl sm:rounded-3xl p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-charcoal">Share this trip</h2>
          <button onClick={onClose} className="min-h-[44px] px-2 text-charcoal/50 font-medium">Close</button>
        </div>
        <div className="flex flex-col gap-3">
          <ShareOption
            emoji="👋"
            title="Guest link"
            who="For everyone on the trip"
            explainer={`They can see everything and change nothing. The first time they open it, they are shown how to add it to their phone’s home screen.${hasPasscode ? ' They will need the passcode you set.' : ''}`}
            url={guestUrl(id)}
            testId="guest-link"
            tone="bg-warm-gray"
          />
          <ShareOption
            emoji="🔑"
            title="Edit link"
            who="For you and co-organisers only"
            explainer="Anyone with this link can change the trip, so share it only with people helping you plan. Keep a copy somewhere safe: it is the only way back to this page from another device."
            url={editUrl(id, token)}
            testId="edit-link"
            tone="bg-marigold/20"
          />
        </div>
      </div>
    </div>
  )
}
