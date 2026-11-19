import { Card } from '../components/Card'
import { TripCountdown } from '../components/home/TripCountdown'
import { WifiCard } from '../components/home/WifiCard'
import { getAppleMapsUrl, getGoogleMapsUrl, getUberUrl } from '../utils/deeplinks'
import { useTrip } from '../contexts/TripContext'
import { useT } from '../i18n/LocaleContext'

export default function HomeTab() {
  const { trip } = useTrip()
  const t = useT()
  const { stay } = trip
  const navAddress = stay.navigationAddress || stay.address
  const hasCoords = stay.lat != null && stay.lng != null
  const hasStayDetails = Boolean(stay.address || stay.wifi.network || stay.checkIn || stay.manual.length)

  return (
    <div className="pb-8">
      {/* Hero photo — full-width bleed */}
      <div className="w-full h-48 bg-teal/20 overflow-hidden flex items-center justify-center">
        {!stay.photo && <span className="text-7xl">{trip.emoji || '🧳'}</span>}
        {stay.photo && <img
          src={stay.photo}
          alt={stay.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />}
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
          {stay.address || trip.destination}
        </p>

        {!hasStayDetails && (
          <Card>
            <p className="text-sm text-charcoal/60 text-center">
              {t('Stay details have not been added yet. Check back soon.')}
            </p>
          </Card>
        )}

        {/* Uber + Maps buttons */}
        {navAddress && (
          <div className={`grid ${hasCoords ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-4`}>
            {hasCoords && (
              <a
                href={getUberUrl(stay.name || trip.name, stay.lat, stay.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
              >
                Uber
              </a>
            )}
            <a
              href={getAppleMapsUrl(navAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
            >
              Apple Maps
            </a>
            <a
              href={getGoogleMapsUrl(navAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-sm"
            >
              Google Maps
            </a>
          </div>
        )}

        {/* Wifi card */}
        {stay.wifi.network && (
          <div className="mb-4">
            <WifiCard />
          </div>
        )}

        {/* Check-in / Check-out card */}
        {(stay.checkIn || stay.checkOut) && (
          <Card>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wide">{t('Check-in')}</p>
                <p className="text-charcoal font-bold">{stay.checkIn}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-charcoal/50 uppercase tracking-wide">{t('Check-out')}</p>
                <p className="text-charcoal font-bold">{stay.checkOut}</p>
              </div>
            </div>
          </Card>
        )}

        {/* House Manual */}
        {stay.manual.length > 0 && (
          <h2 className="font-display text-lg font-bold text-charcoal mt-6 mb-3">
            {t('House Manual')}
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
