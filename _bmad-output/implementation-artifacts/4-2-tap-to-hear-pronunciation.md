# Story 4.2: Tap-to-Hear Pronunciation

Status: ready-for-dev

## Story

As a **family member**,
I want to tap a phrase and hear it spoken in Spanish,
So that I can practice pronunciation before saying it to someone.

## Acceptance Criteria

1. **Given** the device supports the Web Speech API **When** a phrase card is displayed **Then** a tap-to-hear button is visible on the card
2. **Given** the user taps the hear button **When** the Speech API fires **Then** the Spanish text is spoken aloud, using a Spanish voice if available on the device
3. **Given** the device does NOT support Web Speech API **When** the phrase card renders **Then** the tap-to-hear button is hidden (not shown at all) **And** the phonetic text remains visible as the fallback

## Tasks / Subtasks

- [ ] Task 1: Create speech utility (AC: #1, #2, #3)
  - [ ] 1.1: Create `src/utils/speech.js` — export `speakSpanish(text)` that uses `window.speechSynthesis.speak()` with a Spanish voice preference
  - [ ] 1.2: Export `isSpeechSupported()` that returns boolean for `'speechSynthesis' in window`
  - [ ] 1.3: Prefer Spanish voice (`lang.startsWith('es')`) if available; fall back to default voice
- [ ] Task 2: Add hear button to PhraseCard (AC: #1, #2, #3)
  - [ ] 2.1: Update `src/components/phrases/PhraseCard.jsx` — add a speaker/sound emoji button on the right side of the card
  - [ ] 2.2: Conditionally render button only when `isSpeechSupported()` returns true
  - [ ] 2.3: On tap, call `speakSpanish(phrase.spanish)` — button should have 44px tap target
  - [ ] 2.4: Add visual feedback during speech (e.g., toggle button color while speaking)

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes
- **No new npm dependencies** — Web Speech API is a browser native API

### Web Speech API Implementation
```js
// Check support
const isSupported = 'speechSynthesis' in window;

// Speak text
function speakSpanish(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-MX'; // Mexican Spanish preferred
  // Try to find a Spanish voice
  const voices = speechSynthesis.getVoices();
  const spanishVoice = voices.find(v => v.lang.startsWith('es'));
  if (spanishVoice) utterance.voice = spanishVoice;
  speechSynthesis.speak(utterance);
}
```

### PhraseCard Updated Layout (from Story 4.1)
```
+--------------------------------------+
|  English text (bold)          [sound]|
|  Spanish text (teal)                 |
|  phonetic (italic, muted)            |
+--------------------------------------+
```

The sound button should be:
- Right-aligned on the first row, next to English text
- Speaker emoji (🔊) or similar
- 44px min tap target (`min-h-[44px] min-w-[44px]`)
- Teal color to match interactive elements
- When actively speaking: marigold color as feedback

### Previous Story Intelligence (Story 4.1)
- `PhraseCard` component at `src/components/phrases/PhraseCard.jsx`
- Card uses `Card` wrapper with `interactive` prop
- PhrasesTab at `src/pages/PhrasesTab.jsx` with category filter state
- Data imported from `tripData.phrases` — each phrase has `{ category, english, spanish, phonetic }`

### File Structure
New files:
```
src/utils/speech.js              # Web Speech API helper
```

Files to modify:
```
src/components/phrases/PhraseCard.jsx   # Add hear button
```

### What NOT to Do
- Do NOT install any audio/speech npm packages — use native Web Speech API only
- Do NOT use TypeScript
- Do NOT modify `trip.json`
- Do NOT show an error if speech is unavailable — just hide the button silently
- Do NOT add a loading spinner — speech fires near-instantly

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#4.5. Text-to-Speech] — Speech API spec
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — utils/speech.js location

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
