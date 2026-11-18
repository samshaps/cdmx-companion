import { AddButton, ItemCard, LocationField, TextArea, TextField } from './fields'

export function StaySection({ doc, change }) {
  const { stay } = doc.trip
  const set = (key) => (value) => change((d) => { d.trip.stay[key] = value })

  return (
    <div className="flex flex-col gap-4">
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
