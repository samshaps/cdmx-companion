import { useMemo } from 'react'

export function useCurrentDay(itinerary) {
  return useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const idx = itinerary.findIndex(day => day.date === today)
    return idx >= 0 ? idx : 0
  }, [itinerary])
}
