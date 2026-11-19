import { Card } from '../Card'
import { copyToClipboard } from '../../utils/clipboard'
import { useToast } from '../../contexts/ToastContext'
import { useTrip } from '../../contexts/TripContext'
import { useT } from '../../i18n/LocaleContext'

export function WifiCard() {
  const { showToast } = useToast()
  const t = useT()
  const { wifi } = useTrip().trip.stay

  const handleCopy = async () => {
    const ok = await copyToClipboard(wifi.password)
    if (ok) showToast(t('Copied!'))
  }

  return (
    <Card>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-charcoal/50 uppercase tracking-wide">{t('Wifi Network')}</p>
          <p className="text-charcoal font-bold">{wifi.network}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal/50 uppercase tracking-wide">{t('Password')}</p>
            <p className="text-charcoal font-mono font-bold">{wifi.password}</p>
          </div>
          <button
            onClick={handleCopy}
            className="min-h-[44px] min-w-[44px] px-4 text-terracotta font-bold rounded-lg active:scale-[0.98] transition-transform"
          >
            {t('Copy')}
          </button>
        </div>
      </div>
    </Card>
  )
}
