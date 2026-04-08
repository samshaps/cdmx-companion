export function isSpeechSupported() {
  return 'speechSynthesis' in window
}

export function speakSpanish(text) {
  if (!isSpeechSupported()) return

  // Cancel any ongoing speech
  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-MX'

  const voices = speechSynthesis.getVoices()
  const spanishVoice = voices.find(v => v.lang.startsWith('es'))
  if (spanishVoice) utterance.voice = spanishVoice

  speechSynthesis.speak(utterance)
  return utterance
}
