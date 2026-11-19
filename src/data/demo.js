import demoTrip from './demo-trip.json'
import { addDays, daysBetween, localISODate } from '../utils/dates'
import { suggestLocale } from '../../shared/destinations'

// The demo trip is always "in progress": its dates are shifted so that today
// is day 2, which keeps the countdown and NOW/NEXT badges alive in the demo.
export function getDemoTrip(today = localISODate()) {
  const shift = daysBetween(demoTrip.trip.dates.start, today) - 1
  return {
    ...demoTrip,
    trip: {
      ...demoTrip.trip,
      // The demo wears its destination's flag colors.
      skin: suggestLocale(demoTrip.trip.destination)?.skin || null,
      dates: {
        start: addDays(demoTrip.trip.dates.start, shift),
        end: addDays(demoTrip.trip.dates.end, shift),
      },
    },
    itinerary: demoTrip.itinerary.map((day) => ({
      ...day,
      date: addDays(day.date, shift),
    })),
  }
}
