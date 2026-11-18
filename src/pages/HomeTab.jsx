import { Card } from '../components/Card'
import { TripCountdown } from '../components/home/TripCountdown'
import { WifiCard } from '../components/home/WifiCard'
import { getAppleMapsUrl, getGoogleMapsUrl, getUberUrl } from '../utils/deeplinks'
import { useTrip } from '../contexts/TripContext'

export default function HomeTab() {
  const { trip } = useTrip()
  const { stay } = trip

  return (
    <div className="pb-8">
      {/* Hero photo — full-width bleed */}
      <div className="w-full h-48 bg-teal/20 overflow-hidden">
        <img
          src={stay.photo}
          alt={stay.name}
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
          {stay.address}
        </p>

        {/* Uber + Maps buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <a
            href={getUberUrl(stay.name, stay.lat, stay.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
          >
            Uber
          </a>
          <a
            href={getAppleMapsUrl(stay.navigationAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
          >
            Apple Maps
          </a>
          <a
            href={getGoogleMapsUrl(stay.navigationAddress)}
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
              <p className="text-charcoal font-bold">{stay.checkIn}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Check-out</p>
              <p className="text-charcoal font-bold">{stay.checkOut}</p>
            </div>
          </div>
        </Card>

        {/* House Manual */}
        {stay.manual.length > 0 && (
          <h2 className="font-display text-lg font-bold text-charcoal mt-6 mb-3">
            House Manual
          </h2>
        )}

        {stay.manual.map((section) => (
          <Card key={section.title} className="mb-3">
            <h3 className="text-sm font-bold text-charcoal mb-2">{section.title}</h3>
            <p className="text-sm text-charcoal/80 whitespace-pre-line">{section.body}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
