import { useState } from 'react'
import { AddButton, ItemCard, LocationField, TextArea, TextField } from './fields'
import { StayLinkField } from './StayLinkField'

// Shows the photo as guests will see it at the top of Home, so a broken or
// wrong link is obvious, with a one-tap way to clear it.
function PhotoPreview({ src, onRemove }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className="relative -mt-2 rounded-card overflow-hidden bg-teal/20 h-36 flex items-center justify-center">
      {broken
        ? <p className="text-sm text-charcoal/70 px-4 text-center">This link does not load as a picture, so guests will not see a photo.</p>
        : <img src={src} alt="Preview of the stay photo" className="w-full h-full object-cover" onError={() => setBroken(true)} />}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-white/90 text-terracotta text-sm font-bold rounded-full shadow-card px-3 min-h-[36px]"
      >
        Remove photo
      </button>
    </div>
  )
}

export function StaySection({ doc, change, id, token }) {
  const { stay } = doc.trip
  const set = (key) => (value) => change((d) => { d.trip.stay[key] = value })

  // Fill in what the listing page gave us, leaving anything it did not have.
  function applyFromLink(found) {
    change((d) => {
      const s = d.trip.stay
      if (found.name) s.name = found.name
      if (found.photo) s.photo = found.photo
      if (found.address) { s.address = found.address; s.navigationAddress = '' }
      if (found.lat != null) { s.lat = found.lat; s.lng = found.lng }
      if (found.checkIn) s.checkIn = found.checkIn
      if (found.checkOut) s.checkOut = found.checkOut
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <StayLinkField id={id} token={token} onFound={applyFromLink} />
      <TextField label="Name of the place" value={stay.name} onChange={set('name')} placeholder="Casa Jacaranda" maxLength={100} />
      <TextField
        label="Address"
        hint="Shown to guests and used for the Maps buttons."
        value={stay.address}
        onChange={(v) => change((d) => { d.trip.stay.address = v; d.trip.stay.navigationAddress = '' })}
        maxLength={200}
      />
      <LocationField lat={stay.lat} lng={stay.lng} onChange={({ lat, lng }) => change((d) => { d.trip.stay.lat = lat; d.trip.stay.lng = lng })} />
      <TextField label="Photo link (optional)" hint="A web address starting with https:// of a photo of the place." value={stay.photo} onChange={set('photo')} placeholder="https://…" maxLength={500} />
      {stay.photo && <PhotoPreview key={stay.photo} src={stay.photo} onRemove={() => set('photo')('')} />}

      <div className="grid grid-cols-2 gap-3">
        <TextField label="Wifi network" value={stay.wifi.network} onChange={(v) => change((d) => { d.trip.stay.wifi.network = v })} maxLength={100} autoCapitalize="none" />
        <TextField label="Wifi password" value={stay.wifi.password} onChange={(v) => change((d) => { d.trip.stay.wifi.password = v })} maxLength={100} autoCapitalize="none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Check-in" value={stay.checkIn} onChange={set('checkIn')} placeholder="3:00 PM" maxLength={20} />
        <TextField label="Check-out" value={stay.checkOut} onChange={set('checkOut')} placeholder="10:00 AM" maxLength={20} />
      </div>

      <h3 className="font-display text-lg font-bold text-charcoal mt-4">House manual</h3>
      <p className="text-sm text-charcoal/60 -mt-3">Door codes, directions, how the hot tub works. One card per topic.</p>
      {stay.manual.map((section, i) => (
        <ItemCard key={i} title={`Section ${i + 1}`} onRemove={() => change((d) => { d.trip.stay.manual.splice(i, 1) })}>
          <TextField label="Title" value={section.title} onChange={(v) => change((d) => { d.trip.stay.manual[i].title = v })} placeholder="Getting in" maxLength={60} />
          <TextArea label="Details" value={section.body} onChange={(v) => change((d) => { d.trip.stay.manual[i].body = v })} rows={4} maxLength={2000} />
        </ItemCard>
      ))}
      <AddButton onClick={() => change((d) => { d.trip.stay.manual.push({ title: '', body: '' }) })}>Add a section</AddButton>
    </div>
  )
}
