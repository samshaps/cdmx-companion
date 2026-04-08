export function DaySelector({ days, selectedIndex, onSelect }) {
  return (
    <div className="flex gap-2 justify-center px-4 py-3">
      {days.map((day, i) => {
        const dayName = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
        const isActive = i === selectedIndex
        const isBookend = i === 0 || i === days.length - 1

        return (
          <button
            key={day.date}
            onClick={() => onSelect(i)}
            className={`flex flex-col items-center px-3 py-2 rounded-full min-w-[56px] min-h-[44px] font-medium text-sm transition-colors ${
              isActive
                ? 'bg-teal text-white'
                : 'border border-teal text-teal'
            }`}
          >
            {isBookend && <span className="text-xs leading-none">✈️</span>}
            <span>{dayName}</span>
          </button>
        )
      })}
    </div>
  )
}
