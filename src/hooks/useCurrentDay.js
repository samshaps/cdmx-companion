import { useMemo } from 'react'
import { localISODate } from '../utils/dates'

export function useCurrentDay(itinerary) {
  return useMemo(() => {
    const today = localISODate()
    const idx = itinerary.findIndex(day => day.date === today)
    return idx >= 0 ? idx : 0
  }, [itinerary])
}
