import { useState, useEffect } from 'react'
import { Card } from '../Card'
import { isSpeechSupported, speakSpanish } from '../../utils/speech'

export function PhraseCard({ phrase }) {
  const [speechAvailable, setSpeechAvailable] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (isSpeechSupported()) {
      setSpeechAvailable(true)
      // Load voices (some browsers load async)
      speechSynthesis.getVoices()
    }
  }, [])

  function handleSpeak() {
    const utterance = speakSpanish(phrase.spanish)
    if (!utterance) return

    setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
  }

  return (
    <Card interactive>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-charcoal">{phrase.english}</p>
          <p className="text-teal font-medium mt-1">{phrase.spanish}</p>
          <p className="text-charcoal/50 italic text-sm mt-1">{phrase.phonetic}</p>
        </div>
        {speechAvailable && (
          <button
            onClick={handleSpeak}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
              speaking ? 'text-marigold' : 'text-teal'
            }`}
            aria-label={`Listen to "${phrase.spanish}"`}
          >
            <span className="text-xl">{speaking ? '🔊' : '🔈'}</span>
          </button>
        )}
      </div>
    </Card>
  )
}
