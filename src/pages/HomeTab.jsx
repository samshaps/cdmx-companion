import { Card } from '../components/Card'
import { TripCountdown } from '../components/home/TripCountdown'
import { getNavigateUrl, getUberUrl } from '../utils/deeplinks'
import tripData from '../data/trip.json'

export default function HomeTab() {
  const { trip } = tripData

  return (
    <div className="pb-8">
      {/* Hero photo — full-width bleed */}
      <div className="w-full h-48 bg-teal/20 overflow-hidden">
        <img
          src={trip.airbnb.photo}
          alt={trip.airbnb.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* Content with horizontal padding */}
      <div className="px-4 max-w-md mx-auto">
        {/* Trip name + countdown */}
        <div className="flex items-baseline justify-between mt-4 mb-1">
          <h1 className="font-display text-2xl font-bold text-charcoal">
            {trip.name}
          </h1>
          <TripCountdown />
        </div>

        {/* Address */}
        <p className="text-sm text-charcoal/70 mb-4">
          {trip.airbnb.address}
        </p>

        {/* Uber + Maps buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={getUberUrl(trip.airbnb.lat, trip.airbnb.lng, trip.airbnb.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg"
          >
            Open in Uber
          </a>
          <a
            href={getNavigateUrl(trip.airbnb.lat, trip.airbnb.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg"
          >
            Open in Maps
          </a>
        </div>

        {/* Check-in / Check-out card */}
        <Card>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Check-in</p>
              <p className="text-charcoal font-bold">{trip.airbnb.checkIn}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Check-out</p>
              <p className="text-charcoal font-bold">{trip.airbnb.checkOut}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
