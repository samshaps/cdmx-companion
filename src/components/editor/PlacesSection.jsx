import { AddButton, ItemCard, LocationField, SelectField, TextField } from './fields'
import { useT } from '../../i18n/LocaleContext'

const tx = (s) => s // marks text for translation; translated where rendered

const CATEGORY_OPTIONS = [
  { value: 'eat', label: tx('🍽️ Eat') },
  { value: 'drink', label: tx('🍺 Drink') },
  { value: 'see', label: tx('👁️ See') },
  { value: 'shop', label: tx('🛍️ Shop') },
]

export function PlacesSection({ doc, change }) {
  const t = useT()
  const categoryOptions = CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: t(o.label) }))
  const set = (i, key) => (value) => change((d) => { d.places[i][key] = value })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-charcoal/60">
        {t('Recommendations for the Explore tab: restaurants, bars, sights and shops worth knowing about.')}
      </p>
      {doc.places.map((place, i) => (
        <ItemCard key={i} title={place.name || t('Place {n}', { n: i + 1 })} onRemove={() => change((d) => { d.places.splice(i, 1) })}>
          <div className="grid grid-cols-[1fr_7.5rem] gap-3">
            <TextField label={t('Name')} value={place.name} onChange={set(i, 'name')} maxLength={100} />
            <SelectField label={t('Type')} value={place.category} options={categoryOptions} onChange={set(i, 'category')} />
          </div>
          <TextField label={t('Address or neighbourhood')} value={place.address} onChange={set(i, 'address')} maxLength={200} />
          <TextField label={t('Why go (optional)')} value={place.note} onChange={set(i, 'note')} maxLength={300} />
          <LocationField lat={place.lat} lng={place.lng} onChange={({ lat, lng }) => change((d) => { d.places[i].lat = lat; d.places[i].lng = lng })} />
        </ItemCard>
      ))}
      <AddButton onClick={() => change((d) => { d.places.push({ name: '', category: 'eat', lat: null, lng: null, address: '', note: '' }) })}>
        {t('Add a place')}
      </AddButton>
    </div>
  )
}
