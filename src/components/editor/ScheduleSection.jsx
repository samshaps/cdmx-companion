import { useState } from 'react'
import { AddButton, ItemCard, SelectField, TextArea, TextField } from './fields'

const CATEGORY_OPTIONS = [
  { value: 'activity', label: '🎯 Activity' },
  { value: 'meal', label: '🍽️ Meal' },
  { value: 'transit', label: '🚗 Travel' },
  { value: 'free', label: '☀️ Free time' },
]

const dayLabel = (date) =>
  new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export function ScheduleSection({ doc, change }) {
  const [selected, setSelected] = useState(0)
  const index = Math.min(selected, doc.itinerary.length - 1)
  const day = doc.itinerary[index]

  if (!day) return <p className="text-charcoal/60">Set the trip dates under Basics to start planning days.</p>

  const setEvent = (i, key) => (value) => change((d) => { d.itinerary[index].events[i][key] = value })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
        {doc.itinerary.map((d, i) => (
          <button
            key={d.date}
            type="button"
            onClick={() => setSelected(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap min-h-[44px] ${
              i === index ? 'bg-teal text-white' : 'border border-teal text-teal'
            }`}
          >
            {dayLabel(d.date)}
          </button>
        ))}
      </div>

      <TextField label="Title for this day" value={day.dayTitle} onChange={(v) => change((d) => { d.itinerary[index].dayTitle = v })} placeholder="Old town & seafood" maxLength={60} />

      {day.events.map((event, i) => (
        <ItemCard key={i} title={`Event ${i + 1}`} onRemove={() => change((d) => { d.itinerary[index].events.splice(i, 1) })}>
          <div className="grid grid-cols-[7.5rem_1fr] gap-3">
            <TextField label="Time" type="time" value={event.time} onChange={setEvent(i, 'time')} />
            <SelectField label="Type" value={event.category} options={CATEGORY_OPTIONS} onChange={setEvent(i, 'category')} />
          </div>
          <TextField label="What" value={event.name} onChange={setEvent(i, 'name')} placeholder="Dinner: Tasca Exemplo" maxLength={100} />
          <TextField label="Where (optional)" hint="An address or place name for the Maps links." value={event.address} onChange={setEvent(i, 'address')} maxLength={200} />
          <TextArea label="Notes (optional)" value={event.notes} onChange={setEvent(i, 'notes')} rows={2} maxLength={500} />
          <TextField label="Highlighted note (optional)" hint="Stands out on the card, e.g. “Reservation confirmed 8pm”." value={event.personalNote} onChange={setEvent(i, 'personalNote')} maxLength={300} />
        </ItemCard>
      ))}
      <AddButton
        onClick={() => change((d) => {
          d.itinerary[index].events.push({ time: '12:00', name: '', category: 'activity', address: '', notes: '', personalNote: '' })
        })}
      >
        Add an event
      </AddButton>
      <p className="text-xs text-charcoal/50 text-center">Guests see events in time order.</p>
    </div>
  )
}
