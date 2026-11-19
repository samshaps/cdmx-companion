import { useState } from 'react'
import { useTrip } from '../contexts/TripContext'
import { DaySelector } from '../components/schedule/DaySelector'
import { EventCard } from '../components/schedule/EventCard'
import { useCurrentDay } from '../hooks/useCurrentDay'
import { useNowNext } from '../hooks/useNowNext'
import { useT } from '../i18n/LocaleContext'
import { dateLocale } from '../../shared/i18n/index.js'

function getDayLabel(date, dayTitle, locale) {
  const dayName = new Date(date + 'T12:00:00').toLocaleDateString(dateLocale(locale), { weekday: 'long' })
  return `${dayName} — ${dayTitle}`
}

export default function ScheduleTab() {
  const { trip, itinerary } = useTrip()
  const t = useT()
  const initialDay = useCurrentDay(itinerary)
  const [selectedDay, setSelectedDay] = useState(initialDay)
  const day = itinerary[selectedDay] || { date: '', dayTitle: '', events: [] }
  const { nowIndex, nextIndex } = useNowNext(day.events, day.date)

  function getBadge(i) {
    if (i === nowIndex) return 'now'
    if (i === nextIndex) return 'next'
    return null
  }

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center mb-4">
        {t('Schedule')}
      </h1>

      <DaySelector
        days={itinerary}
        selectedIndex={selectedDay}
        onSelect={setSelectedDay}
      />

      <h2 className="font-display text-lg font-semibold text-charcoal mt-4 mb-3">
        {day.date ? getDayLabel(day.date, day.dayTitle, t.locale) : t('No days planned yet')}
      </h2>
      {day.events.length === 0 && (
        <p className="text-sm text-charcoal/50">{t('Nothing planned for this day yet.')}</p>
      )}

      <div className="flex flex-col gap-3">
        {day.events.map((event, i) => (
          <EventCard key={i} event={event} badge={getBadge(i)} destination={trip.destination} />
        ))}
      </div>
    </div>
  )
}
