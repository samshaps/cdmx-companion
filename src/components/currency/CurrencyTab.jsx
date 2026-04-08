import { Card } from '../Card'
import { Converter } from './Converter'
import { useExchangeRate } from '../../hooks/useExchangeRate'

function formatTimestamp(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(ts).toLocaleDateString()
}

export function CurrencyTab() {
  const { rate, lastUpdated, loading, error } = useExchangeRate()

  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center mb-6">
        Money
      </h1>

      {loading && (
        <p className="text-center text-charcoal/50">Loading exchange rate...</p>
      )}

      {error && !rate && (
        <Card className="text-center mb-6">
          <p className="text-charcoal/60">
            Exchange rate unavailable — connect to the internet to fetch the latest rate.
          </p>
        </Card>
      )}

      {rate && (
        <>
          <Card className="text-center mb-6">
            <p className="text-lg font-bold text-charcoal">
              1 USD = {rate.toFixed(2)} MXN
            </p>
            {lastUpdated && (
              <p className="text-sm text-charcoal/50 mt-1">
                Last updated: {formatTimestamp(lastUpdated)}
              </p>
            )}
          </Card>

          <Converter rate={rate} />
        </>
      )}
    </div>
  )
}
