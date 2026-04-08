import { useState, useMemo } from 'react'
import { Card } from '../components/Card'
import { NavigateButton } from '../components/NavigateButton'
import { CategoryFilter } from '../components/CategoryFilter'
import { useGeolocation } from '../hooks/useGeolocation'
import { getDistanceMiles } from '../utils/distance'
import tripData from '../data/trip.json'

const CATEGORY_EMOJI = {
  eat: '🍽️',
  drink: '🍺',
  see: '👁️',
  shop: '🛍️',
}

export default function ExploreTab() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { position, loading: geoLoading } = useGeolocation()
  const { places } = tripData

  const sorted = useMemo(() => {
    const filtered = activeCategory === 'all'
      ? places
      : places.filter((p) => p.category === activeCategory)

    if (position) {
      return [...filtered].sort(
        (a, b) =>
          getDistanceMiles(position.lat, position.lng, a.lat, a.lng) -
          getDistanceMiles(position.lat, position.lng, b.lat, b.lng)
      )
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }, [places, activeCategory, position])

  const subtitle = geoLoading
    ? '📍 Getting your location...'
    : position
      ? '📍 Sorted by distance from you'
      : 'Sorted alphabetically'

  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center">
        Explore
      </h1>
      <p className="text-center text-charcoal/50 text-sm mt-1 mb-4">
        {subtitle}
      </p>

      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="mt-4 flex flex-col gap-3">
        {sorted.map((place) => {
          const distance = position
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
                    {distance.toFixed(1)} mi
                  </span>
                )}
              </div>

              {place.note && (
                <div className="mt-3 bg-warm-gray/50 rounded-lg px-3 py-2">
                  <p className="text-sm text-charcoal/70 italic">"{place.note}"</p>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <NavigateButton lat={place.lat} lng={place.lng} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
