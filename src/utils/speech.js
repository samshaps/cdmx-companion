export function isSpeechSupported() {
  return 'speechSynthesis' in window
}

// langCode is a BCP 47 tag such as "es-MX" or "fr-FR".
export function speak(text, langCode) {
  if (!isSpeechSupported()) return

  // Cancel any ongoing speech
  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langCode

  const base = langCode.split('-')[0]
  const voices = speechSynthesis.getVoices()
  const voice =
    voices.find(v => v.lang === langCode) ||
    voices.find(v => v.lang.startsWith(base))
  if (voice) utterance.voice = voice

  speechSynthesis.speak(utterance)
  return utterance
}
