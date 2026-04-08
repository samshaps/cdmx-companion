const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'eat', label: 'Eat', emoji: '🍽️' },
  { key: 'drink', label: 'Drink', emoji: '🍺' },
  { key: 'see', label: 'See', emoji: '👁️' },
  { key: 'shop', label: 'Shop', emoji: '🛍️' },
]

export function CategoryFilter({ activeCategory, onCategoryChange }) {
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
            {emoji ? `${emoji} ${label}` : label}
          </button>
        )
      })}
    </div>
  )
}
