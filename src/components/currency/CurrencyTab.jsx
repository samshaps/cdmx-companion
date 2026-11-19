import { Card } from '../Card'
import { Converter } from './Converter'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { useTrip } from '../../contexts/TripContext'
import { useT } from '../../i18n/LocaleContext'

function formatTimestamp(ts, t) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('Just now')
  if (mins < 60) return t('{mins} min ago', { mins })
  const hours = Math.floor(mins / 60)
  if (hours < 24) return t('{hours}h ago', { hours })
  // English keeps the browser's own date style, as before.
  return new Date(ts).toLocaleDateString(t.locale === 'en' ? undefined : t.locale)
}

export function CurrencyTab() {
  const { home, local } = useTrip().trip.currency
  const { rate, lastUpdated, loading, error } = useExchangeRate(home, local)
  const t = useT()

  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center mb-6">
        {t('Money')}
      </h1>

      {loading && (
        <p className="text-center text-charcoal/50">{t('Loading exchange rate...')}</p>
      )}

      {error && !rate && (
        <Card className="text-center mb-6">
          <p className="text-charcoal/60">
            {t('Exchange rate unavailable — connect to the internet to fetch the latest rate.')}
          </p>
        </Card>
      )}

      {rate && (
        <>
          <Card className="text-center mb-6">
            <p className="text-lg font-bold text-charcoal">
              1 {home} = {rate.toFixed(2)} {local}
            </p>
            {lastUpdated && (
              <p className="text-sm text-charcoal/50 mt-1">
                {t('Last updated: {when}', { when: formatTimestamp(lastUpdated, t) })}
              </p>
            )}
          </Card>

          <Converter rate={rate} home={home} local={local} />
        </>
      )}
    </div>
  )
}
