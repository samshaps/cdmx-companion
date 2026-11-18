import { Card } from '../components/Card'
import { Link, Page, buttonPrimary, buttonSecondary } from '../components/Page'
import { getMyTrips } from '../lib/localTrips'

const FEATURES = [
  ['🏠', 'The stay', 'Address, wifi, door code and house notes, one tap from Uber or Maps.'],
  ['🗓️', 'The plan', 'A day-by-day schedule that highlights what is happening now and next.'],
  ['🧭', 'The city', 'Your saved places sorted by distance, key phrases, and a currency converter.'],
]

export default function Landing() {
  const myTrips = getMyTrips()

  return (
    <Page>
      <div className="text-center pt-6">
        <div className="text-6xl">🧳</div>
        <h1 className="font-display text-4xl font-bold text-charcoal mt-4">Trip Companion</h1>
        <p className="text-charcoal/70 text-lg mt-3 leading-relaxed">
          One link with everything your group needs for the trip. No app store, no accounts.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <Link to="/new" className={buttonPrimary}>Create a trip</Link>
        <Link to="/demo" className={buttonSecondary}>See the demo trip</Link>
      </div>

      {myTrips.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-charcoal mb-3">Your trips</h2>
          <div className="flex flex-col gap-3">
            {myTrips.map((trip) => (
              <Link key={trip.id} to={`/t/${trip.id}/edit`}>
                <Card interactive>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal">{trip.name}</span>
                    <span className="text-terracotta font-medium text-sm">Manage →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-10">
        {FEATURES.map(([emoji, title, body]) => (
          <Card key={title}>
            <div className="flex gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <h3 className="font-bold text-charcoal">{title}</h3>
                <p className="text-sm text-charcoal/70 mt-0.5">{body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-charcoal/40 mt-10">
        Trips are deleted automatically 30 days after they end.
      </p>
    </Page>
  )
}
