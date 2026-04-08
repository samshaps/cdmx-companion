import { useState } from 'react'
import { Card } from './Card'
import { shouldShowOnboarding } from '../utils/platform'

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(shouldShowOnboarding)

  if (!visible) return null

  function handleDismiss() {
    localStorage.setItem('onboarding_dismissed', 'true')
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center px-6 overflow-y-auto">
      <div className="max-w-sm w-full text-center space-y-6 py-8">
        <div className="text-6xl">🇲🇽</div>

        <h1 className="font-display text-3xl font-bold text-charcoal">
          La Familia CDMX
        </h1>

        <p className="text-charcoal/80 text-lg leading-relaxed">
          Your family trip companion app.
          <br />
          Add it to your home screen to use it like a real app!
        </p>

        <Card>
          <ol className="text-left space-y-4 text-charcoal">
            <li className="flex gap-3">
              <span className="font-bold text-teal shrink-0">1.</span>
              <span>
                Tap the <strong>Share</strong> button{' '}
                <span className="text-teal">↑</span> at the bottom of Safari
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-teal shrink-0">2.</span>
              <span>
                Scroll down and tap{' '}
                <strong>&ldquo;Add to Home Screen&rdquo;</strong>{' '}
                <span className="text-teal">＋</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-teal shrink-0">3.</span>
              <span>
                Tap <strong>&ldquo;Add&rdquo;</strong> in the top right
              </span>
            </li>
          </ol>
          <p className="text-charcoal/60 text-sm mt-4 text-center">
            That&apos;s it! Open it from your home screen anytime.
          </p>
        </Card>

        <button
          onClick={handleDismiss}
          className="w-full bg-teal text-white font-bold rounded-card shadow-card text-lg"
          style={{ minHeight: '48px' }}
        >
          Got it, let&apos;s go!
        </button>
      </div>
    </div>
  )
}
