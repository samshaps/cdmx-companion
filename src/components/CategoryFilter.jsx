import { useT } from '../i18n/LocaleContext'

const tx = (s) => s // marks text for translation; translated where rendered

const CATEGORIES = [
  { key: 'all', label: tx('All') },
  { key: 'eat', label: tx('Eat'), emoji: '🍽️' },
  { key: 'drink', label: tx('Drink'), emoji: '🍺' },
  { key: 'see', label: tx('See'), emoji: '👁️' },
  { key: 'shop', label: tx('Shop'), emoji: '🛍️' },
]

export function CategoryFilter({ activeCategory, onCategoryChange }) {
  const t = useT()
  return (
    <div className="flex gap-2 overflow-x-auto py-2 -mx-1 px-1">
      {CATEGORIES.map(({ key, label, emoji }) => {
        const isActive = activeCategory === key
        return (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
              isActive
                ? 'bg-teal text-white'
                : 'border border-teal text-teal'
            }`}
          >
            {emoji ? `${emoji} ${t(label)}` : t(label)}
          </button>
        )
      })}
    </div>
  )
}
