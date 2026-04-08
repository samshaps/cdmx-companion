/**
 * Detects if the current browser is iOS Safari (not in-app browsers)
 * and NOT running in standalone PWA mode.
 */
export function isIOSSafari() {
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua)
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
  const isStandalone =
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches

  return isIOS && isSafari && !isStandalone
}

/**
 * Returns true if the onboarding overlay should be shown:
 * - User is on iOS Safari (not standalone)
 * - User has NOT previously dismissed the overlay
 */
export function shouldShowOnboarding() {
  return isIOSSafari() && localStorage.getItem('onboarding_dismissed') !== 'true'
}
