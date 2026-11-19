import { getEditToken } from './localTrips'

// Points the browser at the right web app manifest for the current page, so
// "Add to Home Screen" installs the trip being viewed (its name, its link)
// instead of the generic landing page.
//
// An organizer's manifest also carries their edit key, because on iPhone an
// installed app starts with empty storage and would otherwise forget that
// this person can edit.
export function syncManifestLink(route) {
  let href = '/manifest.webmanifest'
  if (route.id) {
    const params = new URLSearchParams({ id: route.id })
    const token = (route.name === 'edit' && window.location.hash.slice(1)) || getEditToken(route.id)
    if (token) params.set('k', token)
    href = `/api/manifest?${params}`
  }
  let link = document.querySelector('link[rel="manifest"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'manifest'
    document.head.appendChild(link)
  }
  if (link.getAttribute('href') !== href) link.setAttribute('href', href)
}

// The other half: an installed organizer app opens at /t/:id?k=<edit key>.
// Remember the key on this device and take it back out of the address.
export function adoptEditKeyFromUrl(rememberMyTrip) {
  const match = /^\/t\/([^/]+)/.exec(window.location.pathname)
  const url = new URL(window.location.href)
  const key = url.searchParams.get('k')
  if (!match || !key) return
  rememberMyTrip(decodeURIComponent(match[1]), '', key)
  url.searchParams.delete('k')
  window.history.replaceState({}, '', url.pathname + url.search + url.hash)
}
