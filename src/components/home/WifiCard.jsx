import { Card } from '../Card'
import { copyToClipboard } from '../../utils/clipboard'
import { useToast } from '../../contexts/ToastContext'
import tripData from '../../data/trip.json'

export function WifiCard() {
  const { showToast } = useToast()
  const { wifi } = tripData.trip.airbnb

  const handleCopy = async () => {
    const ok = await copyToClipboard(wifi.password)
    if (ok) showToast('Copied!')
  }

  return (
    <Card>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-charcoal/50 uppercase tracking-wide">Wifi Network</p>
          <p className="text-charcoal font-bold">{wifi.network}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-charcoal/50 uppercase tracking-wide">Password</p>
            <p className="text-charcoal font-mono font-bold">{wifi.password}</p>
          </div>
          <button
            onClick={handleCopy}
            className="min-h-[44px] min-w-[44px] px-4 text-terracotta font-bold rounded-lg active:scale-[0.98] transition-transform"
          >
            Copy
          </button>
        </div>
      </div>
    </Card>
  )
}
