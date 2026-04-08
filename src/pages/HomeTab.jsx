import { Card } from '../components/Card'
import { TripCountdown } from '../components/home/TripCountdown'
import { WifiCard } from '../components/home/WifiCard'
import { getAppleMapsUrl, getGoogleMapsUrl, getUberUrl } from '../utils/deeplinks'
import tripData from '../data/trip.json'

export default function HomeTab() {
  const { trip } = tripData
  const manual = trip.airbnb.houseManual

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
        <div className="grid grid-cols-3 gap-2 mb-4">
          <a
            href={getUberUrl(trip.airbnb.address, trip.airbnb.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
          >
            Uber
          </a>
          <a
            href={getAppleMapsUrl(trip.airbnb.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
          >
            Apple Maps
          </a>
          <a
            href={getGoogleMapsUrl(trip.airbnb.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
          >
            Google Maps
          </a>
        </div>

        {/* Wifi card */}
        <div className="mb-4">
          <WifiCard />
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

        {/* House Manual */}
        <h2 className="font-display text-lg font-bold text-charcoal mt-6 mb-3">
          House Manual
        </h2>

        {/* Building & Access */}
        <Card>
          <h3 className="text-sm font-bold text-charcoal mb-2">Building & Access</h3>
          <p className="text-sm text-charcoal/80 mb-1">
            <span className="font-semibold">Building:</span> {manual.buildingName}
          </p>
          <p className="text-sm text-charcoal/80 mb-1">
            <span className="font-semibold">Unit:</span> {manual.unit}
          </p>
          <p className="text-sm text-charcoal/80 mb-1">
            <span className="font-semibold">Door code:</span>{' '}
            <span className="font-mono font-bold text-teal">{manual.doorCode}</span>
          </p>
          <p className="text-xs text-charcoal/60 mt-1">{manual.lockNote}</p>
        </Card>

        {/* Entrances */}
        <Card>
          <h3 className="text-sm font-bold text-charcoal mb-2">Getting There</h3>
          <div className="mb-2">
            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">On Foot</p>
            <p className="text-sm text-charcoal/80">{manual.entrances.pedestrian}</p>
            <p className="text-xs text-charcoal/60 mt-1">{manual.directions.pedestrian}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/50 uppercase tracking-wide mb-1">By Car</p>
            <p className="text-sm text-charcoal/80">{manual.entrances.vehicle}</p>
            <p className="text-xs text-charcoal/60 mt-1">{manual.directions.vehicle}</p>
          </div>
        </Card>

        {/* Amenities */}
        <Card>
          <h3 className="text-sm font-bold text-charcoal mb-2">Amenities</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Jacuzzi</p>
              <p className="text-sm text-charcoal/80">{manual.amenities.jacuzzi}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Patio Umbrella Lights</p>
              <p className="text-sm text-charcoal/80">{manual.amenities.patioUmbrella}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Extra Bedding</p>
              <p className="text-sm text-charcoal/80">{manual.amenities.extraBedding}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Gym</p>
              <p className="text-sm text-charcoal/80">{manual.amenities.gym}</p>
            </div>
          </div>
        </Card>

        {/* Cleaning & Trash */}
        <Card>
          <h3 className="text-sm font-bold text-charcoal mb-2">Good to Know</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Extra Cleaning</p>
              <p className="text-sm text-charcoal/80">{manual.cleaning}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Trash</p>
              <p className="text-sm text-charcoal/80">{manual.trash}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
