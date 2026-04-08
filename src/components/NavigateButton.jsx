import { getNavigateUrl } from '../utils/deeplinks'

export function NavigateButton({ lat, lng }) {
  const url = getNavigateUrl(lat, lng)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-terracotta font-medium min-h-[44px] min-w-[44px] px-3 py-2 ml-auto"
    >
      🧭 Navigate
    </a>
  )
}
