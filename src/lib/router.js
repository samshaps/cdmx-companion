import { useEffect, useState } from 'react'

// A five-route app does not need a routing library.
//   /                landing
//   /demo            the demo trip
//   /new             create a trip
//   /t/:id           a trip, as guests see it
//   /t/:id/edit      the organiser's page (edit token travels in the #hash,
//                    which browsers never send to a server)
export function parseRoute(pathname) {
  const trip = /^\/t\/([^/]+)(\/edit)?\/?$/.exec(pathname)
  if (trip) return { name: trip[2] ? 'edit' : 'trip', id: decodeURIComponent(trip[1]) }
  if (pathname === '/demo') return { name: 'demo' }
  if (pathname === '/new') return { name: 'new' }
  return { name: 'landing' }
}

export function navigate(to) {
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

export function useRoute() {
  const [pathname, setPathname] = useState(window.location.pathname)
  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])
  return parseRoute(pathname)
}

export const guestUrl = (id) => `${window.location.origin}/t/${encodeURIComponent(id)}`
export const editUrl = (id, token) => `${guestUrl(id)}/edit#${token}`
