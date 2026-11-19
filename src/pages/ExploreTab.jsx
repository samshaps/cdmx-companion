import { useState, useMemo } from 'react'
import { Card } from '../components/Card'
import { NavigateButton } from '../components/NavigateButton'
import { CategoryFilter } from '../components/CategoryFilter'
import { useGeolocation } from '../hooks/useGeolocation'
import { getDistanceMiles } from '../utils/distance'
import { useTrip } from '../contexts/TripContext'
import { useT } from '../i18n/LocaleContext'
import { usesMiles } from '../../shared/i18n/index.js'

const KM_PER_MILE = 1.609344

const CATEGORY_EMOJI = {
  eat: '🍽️',
  drink: '🍺',
  see: '👁️',
  shop: '🛍️',
}

export default function ExploreTab() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { position, loading: geoLoading } = useGeolocation()
  const { trip, places } = useTrip()
  const t = useT()
  const miles = usesMiles(t.locale)

  const sorted = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? places
      : places.filter((p) => p.category === activeCategory)

    if (position) {
      const distanceTo = (p) =>
        p.lat == null || p.lng == null ? Infinity : getDistanceMiles(position.lat, position.lng, p.lat, p.lng)
      return [...filtered].sort((a, b) => distanceTo(a) - distanceTo(b))
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }, [places, activeCategory, position])

  const subtitle = geoLoading
    ? t('📍 Getting your location...')
    : position
      ? t('📍 Sorted by distance from you')
      : t('Sorted alphabetically')

  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center">
        {t('Explore')}
      </h1>
      <p className="text-center text-charcoal/50 text-sm mt-1 mb-4">
        {subtitle}
      </p>

      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {places.length === 0 && (
        <p className="text-sm text-charcoal/50 text-center mt-6">{t('No places have been saved yet.')}</p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {sorted.map((place) => {
          const distance = position && place.lat != null && place.lng != null
            ? getDistanceMiles(position.lat, position.lng, place.lat, place.lng)
            : null

          return (
            <Card key={place.name}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_EMOJI[place.category]}</span>
                    <h3 className="font-bold text-charcoal truncate">{place.name}</h3>
                  </div>
                  <p className="text-sm text-charcoal/60 mt-1">{place.address}</p>
                </div>
                {distance !== null && (
                  <span className="text-sm text-terracotta/70 font-medium whitespace-nowrap mt-1">
                    {miles ? `${distance.toFixed(1)} mi` : `${(distance * KM_PER_MILE).toFixed(1)} km`}
                  </span>
                )}
              </div>

              {place.note && (
                <div className="mt-3 bg-warm-gray/50 rounded-lg px-3 py-2">
                  <p className="text-sm text-charcoal/70 italic">"{place.note}"</p>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <NavigateButton name={[place.name, place.address, trip.destination].filter(Boolean).join(' ')} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
