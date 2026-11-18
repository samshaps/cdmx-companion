import { useEffect, useRef } from 'react'

// One pill per day. Short trips sit centred; long ones scroll sideways, with
// the selected day kept in view.
export function DaySelector({ days, selectedIndex, onSelect }) {
  const selected = useRef(null)

  useEffect(() => {
    selected.current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [selectedIndex])

  return (
    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 py-3">
      <div className="flex gap-2 w-max mx-auto">
        {days.map((day, i) => {
          const date = new Date(day.date + 'T12:00:00')
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          const isActive = i === selectedIndex
          const isBookend = i === 0 || i === days.length - 1

          return (
            <button
              key={day.date}
              ref={isActive ? selected : null}
              onClick={() => onSelect(i)}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl min-w-[56px] min-h-[52px] font-medium text-sm leading-tight transition-colors ${
                isActive
                  ? 'bg-teal text-white'
                  : 'border border-teal text-teal'
              }`}
            >
              <span className="text-xs">{isBookend ? '✈️ ' : ''}{dayName}</span>
              <span className="font-bold">{date.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
