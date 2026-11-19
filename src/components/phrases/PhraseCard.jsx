import { useState, useEffect } from 'react'
import { Card } from '../Card'
import { isSpeechSupported, speak } from '../../utils/speech'
import { useT } from '../../i18n/LocaleContext'

export function PhraseCard({ phrase, langCode }) {
  const [speechAvailable] = useState(isSpeechSupported)
  const [speaking, setSpeaking] = useState(false)
  const t = useT()

  useEffect(() => {
    // Load voices (some browsers load async)
    if (speechAvailable) speechSynthesis.getVoices()
  }, [speechAvailable])

  function handleSpeak() {
    const utterance = speak(phrase.translation, langCode)
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
          <p className="text-teal font-medium mt-1">{phrase.translation}</p>
          <p className="text-charcoal/50 italic text-sm mt-1">{phrase.phonetic}</p>
        </div>
        {speechAvailable && (
          <button
            onClick={handleSpeak}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
              speaking ? 'text-marigold' : 'text-teal'
            }`}
            aria-label={t('Listen to "{phrase}"', { phrase: phrase.translation })}
          >
            <span className="text-xl">{speaking ? '🔊' : '🔈'}</span>
          </button>
        )}
      </div>
    </Card>
  )
}
