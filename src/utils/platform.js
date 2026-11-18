// Works out how (and whether) this browser can put the app on a home screen,
// so the install guide can show the right steps.
//
//   'installed'      already running from the home screen
//   'ios-safari'     iPhone/iPad Safari
//   'ios-browser'    another iPhone browser (Chrome, Firefox, Edge)
//   'android'        Android Chrome and friends
//   'in-app'         a browser embedded in another app (Instagram, WhatsApp
//                    previews, …) that cannot install anything
//   'desktop'        everything else; no guide is shown
export function getInstallPlatform() {
  const ua = navigator.userAgent
  const standalone =
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  if (standalone) return 'installed'

  const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|LinkedInApp|Twitter|MicroMessenger|; wv\)/.test(ua)
  // iPadOS reports itself as a Mac, but Macs do not have touch screens.
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  if (isIOS) {
    if (inApp || !/Safari\//.test(ua)) return 'in-app'
    return /CriOS|FxiOS|EdgiOS/.test(ua) ? 'ios-browser' : 'ios-safari'
  }
  if (/Android/.test(ua)) return inApp ? 'in-app' : 'android'
  return 'desktop'
}

export function canShowInstallGuide() {
  const platform = getInstallPlatform()
  return platform !== 'installed' && platform !== 'desktop'
}

const DISMISSED_KEY = 'install_guide_dismissed'

export function shouldAutoShowInstallGuide() {
  return canShowInstallGuide() && localStorage.getItem(DISMISSED_KEY) !== 'true'
}

export function dismissInstallGuide() {
  localStorage.setItem(DISMISSED_KEY, 'true')
}

// Android Chrome offers a real one-tap install. The event fires once, early,
// so it is captured at startup and kept for whenever the guide is opened.
let installPrompt = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt = event
  })
}

export const hasNativeInstallPrompt = () => installPrompt !== null

export async function showNativeInstallPrompt() {
  if (!installPrompt) return false
  installPrompt.prompt()
  const { outcome } = await installPrompt.userChoice
  installPrompt = null
  return outcome === 'accepted'
}
