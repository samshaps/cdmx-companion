import { useState } from 'react'
import { useTrip } from '../contexts/TripContext'
import { PhraseCard } from '../components/phrases/PhraseCard'

function toLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}
export default function PhrasesTab() {
  const { trip, phrases } = useTrip()
  const categories = [...new Set(phrases.map(p => p.category))]
  const [selected, setSelected] = useState(null)
  const activeCategory = categories.includes(selected) ? selected : categories[0]
  const filteredPhrases = phrases.filter(p => p.category === activeCategory)
  const langCode = trip.language.code
  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-charcoal">
        Phrases
      </h1>
      <p className="text-charcoal/50 text-sm mt-1">
        Tap a category, then tap 🔈 to hear it spoken
      </p>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto mt-4 pb-2 -mx-4 px-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap min-h-[44px] transition-colors ${
              activeCategory === cat
                ? 'bg-teal text-white'
                : 'border border-teal text-teal'
            }`}
          >
            {toLabel(cat)}
          </button>
        ))}
      </div>

      {/* Phrase cards */}
      <div className="flex flex-col gap-3 mt-4">
        {filteredPhrases.map((phrase, i) => (
          <PhraseCard key={`${phrase.category}-${i}`} phrase={phrase} langCode={langCode} />
        ))}
      </div>

      {/* Google Translate link */}
      <div className="mt-6 text-center">
        <a
          href={`https://translate.google.com/?sl=en&tl=${langCode.split('-')[0]}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal font-medium text-sm underline underline-offset-2"
        >
          Open Google Translate →
        </a>
      </div>
    </div>
  )
}
