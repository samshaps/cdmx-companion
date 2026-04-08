import tripData from '../../data/trip.json'

export function TripCountdown() {
  const { trip } = tripData
  const today = new Date()
  const start = new Date(trip.dates.start + 'T00:00:00')
  const end = new Date(trip.dates.end + 'T00:00:00')

  // Strip time from today for date-only comparison
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())

  const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
  const msPerDay = 1000 * 60 * 60 * 24

  // Pre-trip — show nothing
  if (todayDate < startDate) {
    return null
  }

  // During trip
  if (todayDate <= endDate) {
    const dayNum = Math.floor((todayDate - startDate) / msPerDay) + 1
    return (
      <span className="text-marigold font-bold">
        Day {dayNum} of {totalDays}!
      </span>
    )
  }

  // Post-trip
  return (
    <span className="text-charcoal/50 text-sm">
      Trip complete
    </span>
  )
}
