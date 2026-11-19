import { useState } from 'react'
import { buttonPrimary } from './Page'
import {
  AddSquareIcon, AndroidConfirmArt, AndroidListArt, AndroidMenuArt, HomeScreenArt,
  IosConfirmArt, IosSheetArt, IosShareArt, OpenInBrowserArt, ShareIcon,
} from './InstallArt'
import { useT } from '../i18n/LocaleContext'
import { getInstallPlatform, hasNativeInstallPrompt, showNativeInstallPrompt } from '../utils/platform'

const inline = 'inline-block w-4 h-4 align-text-bottom text-teal'

// One screen per step: a picture of what the phone will show, and one
// sentence saying what to tap.
function stepsFor(platform, { emoji, name }, t) {
  const finish = {
    title: t('Open it from your home screen'),
    body: t('From now on, tap the icon like any other app. It opens instantly and works without signal.'),
    art: <HomeScreenArt emoji={emoji} name={name} />,
  }
  if (platform === 'in-app') {
    const isAndroid = /Android/.test(navigator.userAgent)
    const browser = isAndroid ? 'Chrome' : 'Safari'
    return [{
      title: t('First, open this in {browser}', { browser }),
      body: t('You are inside another app’s built-in browser, which cannot add apps. Tap the ⋯ menu and choose “Open in {browser}”, then follow the steps there.', { browser }),
      art: <OpenInBrowserArt emoji={emoji} browser={browser} />,
    }]
  }
  if (platform === 'android') {
    return [
      { title: t('Tap the ⋮ menu'), body: t('It is at the top right of Chrome.'), art: <AndroidMenuArt emoji={emoji} /> },
      { title: t('Tap “Add to Home screen”'), body: t('On some phones it says “Install app”.'), art: <AndroidListArt emoji={emoji} /> },
      { title: t('Tap “Install”'), body: t('Confirm, and the icon appears with your other apps.'), art: <AndroidConfirmArt emoji={emoji} name={name} /> },
      finish,
    ]
  }
  const chrome = platform === 'ios-browser'
  return [
    {
      title: <>{t('Tap the Share button')} <ShareIcon className={inline} /></>,
      body: chrome
        ? t('It is at the top right, at the end of the address bar.')
        : t('It is in the bar at the bottom of Safari. On newer iPhones, tap ⋯ first and then Share.'),
      art: <IosShareArt emoji={emoji} top={chrome} />,
    },
    {
      title: <>{t('Tap “Add to Home Screen”')} <AddSquareIcon className={inline} /></>,
      body: t('Scroll down the list to find it. If it is missing, tap “More” at the end of the row.'),
      art: <IosSheetArt emoji={emoji} />,
    },
    { title: t('Tap “Add”'), body: t('It is at the top right of the next screen.'), art: <IosConfirmArt emoji={emoji} name={name} /> },
    finish,
  ]
}

// Full-screen walkthrough for putting the trip on the phone's home screen.
// Shown once automatically on a phone, and reopenable from the Home tab.
export function InstallGuide({ name, emoji, onClose }) {
  const t = useT()
  const [platform] = useState(getInstallPlatform)
  const [index, setIndex] = useState(-1) // -1 is the "why bother" intro
  const icon = emoji || '🧳'
  const steps = stepsFor(platform, { emoji: icon, name }, t)
  const step = steps[index]
  const last = index === steps.length - 1

  async function handleStart() {
    // Android can often skip the manual steps entirely.
    if (hasNativeInstallPrompt() && (await showNativeInstallPrompt())) return onClose()
    setIndex(0)
  }

  return (
    <div role="dialog" aria-label={t('Add to home screen')} className="fixed inset-0 z-[60] bg-cream overflow-y-auto">
      <div className="max-w-sm mx-auto min-h-full flex flex-col px-6 py-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="min-h-[44px] px-2 text-charcoal/50 font-medium">
            {index === -1 ? t('Not now') : t('Close')}
          </button>
        </div>

        {index === -1 ? (
          <div className="flex-1 flex flex-col justify-center text-center">
            <div className="mx-auto w-24 h-24 rounded-3xl bg-teal flex items-center justify-center text-5xl shadow-card">{icon}</div>
            <h1 className="font-display text-3xl font-bold text-charcoal mt-6">{t('Put {name} on your home screen', { name })}</h1>
            <p className="text-charcoal/70 text-lg mt-3 leading-relaxed">
              {t('It takes about ten seconds, and then the trip is one tap away, like a real app, even with no signal.')}
            </p>
            <button onClick={handleStart} className={`${buttonPrimary} mt-8 text-lg`}>{t('Show me how')}</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col text-center">
            <p className="text-sm font-bold text-terracotta uppercase tracking-wide">
              {steps.length > 1 ? t('Step {n} of {total}', { n: index + 1, total: steps.length }) : t('One thing first')}
            </p>
            <h1 className="font-display text-2xl font-bold text-charcoal mt-2">{step.title}</h1>
            <p className="text-charcoal/70 mt-2 mb-6 min-h-[3rem]">{step.body}</p>
            {step.art}
            <div className="flex-1" />
            <div className="flex gap-3 mt-6">
              {index > 0 && (
                <button onClick={() => setIndex(index - 1)} className="min-h-[48px] px-5 font-bold text-teal">{t('Back')}</button>
              )}
              <button onClick={() => (last ? onClose() : setIndex(index + 1))} className={buttonPrimary}>
                {last ? t('Done') : t('Next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
