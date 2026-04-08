import { Card } from './components/Card'
import tripData from './data/trip.json'

function App() {
  const { trip } = tripData

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-charcoal text-center mb-2">
        {trip.name}
      </h1>
      <p className="text-center text-charcoal/70 mb-8">
        Your family trip companion
      </p>

      <div className="max-w-md mx-auto space-y-4">
        <Card>
          <h2 className="font-display text-xl font-bold text-teal mb-1">
            {trip.airbnb.name}
          </h2>
          <p className="text-sm text-charcoal/70">
            {trip.airbnb.address}
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-bold text-teal mb-2">
            Design System
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="w-8 h-8 rounded-full bg-terracotta" title="Terracotta" />
            <span className="w-8 h-8 rounded-full bg-teal" title="Deep Teal" />
            <span className="w-8 h-8 rounded-full bg-cream border border-charcoal/20" title="Warm Cream" />
            <span className="w-8 h-8 rounded-full bg-marigold" title="Marigold" />
            <span className="w-8 h-8 rounded-full bg-charcoal" title="Charcoal" />
            <span className="w-8 h-8 rounded-full bg-teal-light" title="Light Teal" />
            <span className="w-8 h-8 rounded-full bg-warm-gray border border-charcoal/10" title="Warm Gray" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App
