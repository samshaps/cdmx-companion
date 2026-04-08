import { useState } from 'react'
import tripData from '../data/trip.json'
import { DaySelector } from '../components/schedule/DaySelector'
import { EventCard } from '../components/schedule/EventCard'
import { useCurrentDay } from '../hooks/useCurrentDay'
import { useNowNext } from '../hooks/useNowNext'

const { itinerary } = tripData

function getDayLabel(date, dayTitle) {
  const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })
  return `${dayName} — ${dayTitle}`
}

export default function ScheduleTab() {
  const initialDay = useCurrentDay(itinerary)
  const [selectedDay, setSelectedDay] = useState(initialDay)
  const day = itinerary[selectedDay]
  const { nowIndex, nextIndex } = useNowNext(day.events, day.date)

  function getBadge(i) {
    if (i === nowIndex) return 'now'
    if (i === nextIndex) return 'next'
    return null
  }

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center mb-4">
        Schedule
      </h1>

      <DaySelector
        days={itinerary}
        selectedIndex={selectedDay}
        onSelect={setSelectedDay}
      />

      <h2 className="font-display text-lg font-semibold text-charcoal mt-4 mb-3">
        {getDayLabel(day.date, day.dayTitle)}
      </h2>

      <div className="flex flex-col gap-3">
        {day.events.map((event, i) => (
          <EventCard key={i} event={event} badge={getBadge(i)} />
        ))}
      </div>
    </div>
  )
}
