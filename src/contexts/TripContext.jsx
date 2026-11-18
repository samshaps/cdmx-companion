import { createContext, useContext, useEffect } from 'react'

const TripContext = createContext(null)

// Every screen reads trip content through useTrip(), so where the content
// comes from (bundled demo, API, offline cache) is decided in one place.
export function TripProvider({ data, children }) {
  useEffect(() => {
    document.title = data.trip.name
  }, [data.trip.name])

  return <TripContext.Provider value={data}>{children}</TripContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTrip() {
  const data = useContext(TripContext)
  if (!data) throw new Error('useTrip must be used inside <TripProvider>')
  return data
}
