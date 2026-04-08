import { getAppleMapsUrl, getGoogleMapsUrl } from '../utils/deeplinks'

export function NavigateButton({ name }) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <a
        href={getAppleMapsUrl(name)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-terracotta font-medium min-h-[44px] min-w-[44px] px-2 py-2 text-sm"
      >
        Apple
      </a>
      <span className="text-charcoal/30">|</span>
      <a
        href={getGoogleMapsUrl(name)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-terracotta font-medium min-h-[44px] min-w-[44px] px-2 py-2 text-sm"
      >
        Google
      </a>
    </div>
  )
}
