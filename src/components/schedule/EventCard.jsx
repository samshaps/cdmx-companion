import { Card } from '../Card'
import { NavigateButton } from '../NavigateButton'

const CATEGORY_EMOJI = {
  transit: '🚗',
  meal: '🍽️',
  activity: '🎯',
  free: '☀️',
}

const CATEGORY_BORDER = {
  transit: 'border-l-charcoal',
  meal: 'border-l-terracotta',
  activity: 'border-l-teal',
  free: 'border-l-marigold',
}

function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}

function Badge({ type }) {
  if (type === 'now') {
    return (
      <span className="inline-block bg-marigold text-white text-xs font-bold px-2 py-0.5 rounded-full mb-1">
        NOW
      </span>
    )
  }
  if (type === 'next') {
    return (
      <span className="inline-block border border-teal-light text-teal-light text-xs font-bold px-2 py-0.5 rounded-full mb-1">
        NEXT
      </span>
    )
  }
  return null
}

export function EventCard({ event, badge }) {
  const { time, name, category, notes, personalNote, lat, lng } = event
  const emoji = CATEGORY_EMOJI[category] || '📌'
  const borderClass = CATEGORY_BORDER[category] || 'border-l-charcoal'

  return (
    <Card interactive className={`border-l-[3px] ${borderClass}`}>
      <Badge type={badge} />
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-charcoal/60 font-medium">
            {formatTime(time)}
          </p>
          <h3 className="font-sans font-semibold text-charcoal text-base leading-tight">
            {name}
          </h3>
          {notes && (
            <p className="text-sm text-charcoal/70 mt-1">{notes}</p>
          )}
          {personalNote && (
            <div className="mt-2 flex items-start gap-2 bg-cream/60 rounded-lg px-3 py-2">
              <span className="text-sm">💬</span>
              <p className="text-sm italic text-charcoal/60">{personalNote}</p>
            </div>
          )}
          {lat && lng && (
            <div className="flex justify-end mt-2">
              <NavigateButton lat={lat} lng={lng} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
