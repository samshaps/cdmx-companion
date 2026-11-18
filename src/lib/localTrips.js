// What this device remembers, all in localStorage:
// - the last copy of each trip it opened, so the app works offline
// - the passcode a guest entered, so they are asked once
// - edit links for trips created here, so the organiser can find them again

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* storage full or blocked: the app still works online */ }
}

export const getCachedTrip = (id) => read(`trip_cache:${id}`, null)
export const cacheTrip = (id, doc) => write(`trip_cache:${id}`, doc)
export const forgetCachedTrip = (id) => localStorage.removeItem(`trip_cache:${id}`)

export const getPasscode = (id) => read(`trip_passcode:${id}`, '')
export const rememberPasscode = (id, passcode) => write(`trip_passcode:${id}`, passcode)

export const getMyTrips = () => read('my_trips', [])
export const getEditToken = (id) => getMyTrips().find((t) => t.id === id)?.token || ''
export function rememberMyTrip(id, name, token) {
  const others = getMyTrips().filter((t) => t.id !== id)
  write('my_trips', [{ id, name, token }, ...others].slice(0, 20))
}
export function forgetMyTrip(id) {
  write('my_trips', getMyTrips().filter((t) => t.id !== id))
}
