import { useCallback, useEffect, useState } from 'react'
import { fetchTrip } from '../lib/api'
import { cacheTrip, forgetCachedTrip, getCachedTrip, getPasscode, rememberPasscode } from '../lib/localTrips'

// Loads a trip for a guest. Shows the saved copy instantly (and keeps
// showing it when offline) while refreshing from the server in the background.
//
// status: 'loading' | 'ready' | 'passcode' | 'notfound' | 'error'
export function useRemoteTrip(id) {
  const [state, setState] = useState(() => {
    const cached = getCachedTrip(id)
    return cached ? { status: 'ready', data: cached, offline: false } : { status: 'loading' }
  })

  const load = useCallback(async (passcode) => {
    try {
      const { doc } = await fetchTrip(id, { passcode: passcode || getPasscode(id) })
      if (passcode) rememberPasscode(id, passcode)
      cacheTrip(id, doc)
      setState({ status: 'ready', data: doc, offline: false })
    } catch (error) {
      if (error.status === 401) {
        forgetCachedTrip(id)
        setState({ status: 'passcode', lockedTrip: error.body.trip, wrong: Boolean(passcode) })
      } else if (error.status === 404) {
        forgetCachedTrip(id)
        setState({ status: 'notfound' })
      } else {
        // Offline or server trouble: keep whatever copy we already have.
        const cached = getCachedTrip(id)
        setState(cached
          ? { status: 'ready', data: cached, offline: true }
          : { status: 'error', message: error.status === 429 ? error.message : null })
      }
    }
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state is set after the fetch resolves
    load()
  }, [load])

  return { ...state, submitPasscode: load }
}
