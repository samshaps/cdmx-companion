import { useState } from 'react'
import tripData from '../data/trip.json'
import { PhraseCard } from '../components/phrases/PhraseCard'

const CATEGORIES = [
  { key: 'greetings', label: 'Greetings' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'directions', label: 'Directions' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'emergency', label: 'Emergency' },
]

export default function PhrasesTab() {
  const [activeCategory, setActiveCategory] = useState('greetings')

  const filteredPhrases = tripData.phrases.filter(
    p => p.category === activeCategory
  )

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
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap min-h-[44px] transition-colors ${
              activeCategory === cat.key
                ? 'bg-teal text-white'
                : 'border border-teal text-teal'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Phrase cards */}
      <div className="flex flex-col gap-3 mt-4">
        {filteredPhrases.map((phrase, i) => (
          <PhraseCard key={`${phrase.category}-${i}`} phrase={phrase} />
        ))}
      </div>

      {/* Google Translate link */}
      <div className="mt-6 text-center">
        <a
          href="https://translate.google.com/?sl=en&tl=es"
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
