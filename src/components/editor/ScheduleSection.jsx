import { useState } from 'react'
import { AddButton, ItemCard, SelectField, TextArea, TextField } from './fields'
import { inputClass } from '../Page'
import { DAY_SLOTS } from '../../../shared/tripSchema'
import { dateLocale } from '../../../shared/i18n/index.js'
import { useT } from '../../i18n/LocaleContext'

const tx = (s) => s // marks text for translation; translated where rendered

const CATEGORY_OPTIONS = [
  { value: 'activity', label: tx('🎯 Activity') },
  { value: 'meal', label: tx('🍽️ Meal') },
  { value: 'transit', label: tx('🚗 Travel') },
  { value: 'free', label: tx('☀️ Free time') },
]

const dayLabel = (date, t) =>
  new Date(date + 'T12:00:00').toLocaleDateString(dateLocale(t.locale), { weekday: 'short', month: 'short', day: 'numeric' })

function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function EventDetails({ event, set, showType }) {
  const t = useT()
  const categoryOptions = CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: t(o.label) }))
  return (
    <>
      <div className={showType ? 'grid grid-cols-[7.5rem_1fr] gap-3' : ''}>
        <TextField label={t('Time')} type="time" value={event.time} onChange={set('time')} />
        {showType && <SelectField label={t('Type')} value={event.category} options={categoryOptions} onChange={set('category')} />}
      </div>
      <TextField label={t('Where (optional)')} hint={t('An address or place name for the Maps links.')} value={event.address} onChange={set('address')} maxLength={200} />
      <TextArea label={t('Notes (optional)')} value={event.notes} onChange={set('notes')} rows={2} maxLength={500} />
      <TextField label={t('Highlighted note (optional)')} hint={t('Stands out on the card, e.g. “Reservation confirmed 8pm”.')} value={event.personalNote} onChange={set('personalNote')} maxLength={300} />
    </>
  )
}

// One ready-made blank for a part of the day. Typing in it creates the
// event; time, place and notes are tucked behind "Add details".
function SlotCard({ slot, event, onName, set }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <div data-testid={`slot-${slot.key}`} className="bg-warm-gray rounded-card shadow-card p-4 flex flex-col gap-3">
      <label className="block">
        <span className="flex items-center justify-between text-sm font-bold text-charcoal mb-1">
          <span>{slot.emoji} {t(slot.label)}</span>
          {event && <span className="font-medium text-charcoal/50">{formatTime(event.time)}</span>}
        </span>
        <input
          className={inputClass}
          value={event?.name ?? ''}
          onChange={(e) => onName(e.target.value)}
          placeholder={t('Nothing planned')}
          aria-label={t(slot.label)}
          maxLength={100}
        />
      </label>
      {event && (
        <button type="button" onClick={() => setOpen(!open)} className="self-start text-terracotta text-sm font-bold min-h-[32px]">
          {open ? t('Hide details') : t('Time, place & notes')}
        </button>
      )}
      {event && open && <EventDetails event={event} set={set} />}
    </div>
  )
}

export function ScheduleSection({ doc, change }) {
  const t = useT()
  const [selected, setSelected] = useState(0)
  const index = Math.min(selected, doc.itinerary.length - 1)
  const day = doc.itinerary[index]

  if (!day) return <p className="text-charcoal/60">{t('Set the trip dates under Basics to start planning days.')}</p>

  const setEvent = (i) => (key) => (value) => change((d) => { d.itinerary[index].events[i][key] = value })

  function setSlotName(slot, i, name) {
    change((d) => {
      const events = d.itinerary[index].events
      if (i === -1) {
        events.push({ slot: slot.key, time: slot.time, category: slot.category, name, address: '', notes: '', personalNote: '' })
      } else if (name === '' && !events[i].address && !events[i].notes && !events[i].personalNote) {
        events.splice(i, 1) // emptied again: back to a blank
      } else {
        events[i].name = name
      }
    })
  }

  const extras = day.events.map((event, i) => ({ event, i })).filter(({ event }) => !event.slot)

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
            {dayLabel(d.date, t)}
          </button>
        ))}
      </div>

      <TextField label={t('Title for this day')} value={day.dayTitle} onChange={(v) => change((d) => { d.itinerary[index].dayTitle = v })} placeholder={t('Old town & seafood')} maxLength={60} />

      <p className="text-sm text-charcoal/60 -mb-1">{t('Fill in what you have. Blanks are simply left off the guest schedule.')}</p>
      {DAY_SLOTS.map((slot) => {
        const i = day.events.findIndex((e) => e.slot === slot.key)
        return (
          <SlotCard
            key={`${day.date}-${slot.key}`}
            slot={slot}
            event={day.events[i]}
            onName={(name) => setSlotName(slot, i, name)}
            set={setEvent(i)}
          />
        )
      })}

      {extras.length > 0 && <h3 className="font-display text-lg font-bold text-charcoal mt-2">{t('Also that day')}</h3>}
      {extras.map(({ event, i }, n) => (
        <ItemCard key={i} title={t('Extra {n}', { n: n + 1 })} onRemove={() => change((d) => { d.itinerary[index].events.splice(i, 1) })}>
          <TextField label={t('What')} value={event.name} onChange={setEvent(i)('name')} placeholder={t('Airport pickup')} maxLength={100} />
          <EventDetails event={event} set={setEvent(i)} showType />
        </ItemCard>
      ))}
      <AddButton
        onClick={() => change((d) => {
          d.itinerary[index].events.push({ slot: '', time: '12:00', name: '', category: 'activity', address: '', notes: '', personalNote: '' })
        })}
      >
        {t('Add something else')}
      </AddButton>
      <p className="text-xs text-charcoal/50 text-center">{t('Guests see everything in time order.')}</p>
    </div>
  )
}
