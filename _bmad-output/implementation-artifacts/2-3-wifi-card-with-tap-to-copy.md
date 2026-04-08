# Story 2.3: Wifi Card with Tap-to-Copy

Status: review

## Story

As a **family member**,
I want to see the wifi password and copy it with one tap,
So that I can connect without typing a long password or asking again.

## Acceptance Criteria

1. **Given** the Home tab is displayed **When** the user views the wifi card **Then** the wifi network name is displayed **And** the password is displayed with a visible "Copy" button
2. **Given** the user taps the "Copy" button **When** the clipboard write succeeds **Then** the password is copied to the device clipboard **And** a "Copied!" toast appears bottom-center and auto-dismisses after 2 seconds

## Tasks / Subtasks

- [x] Task 1: Create WifiCard component (AC: #1)
  - [x] 1.1: Create `src/components/home/WifiCard.jsx` — displays wifi network name and password using a `Card` component wrapper
  - [x] 1.2: Show network name with a wifi emoji prefix and label
  - [x] 1.3: Show password with a "Copy" button inline — button should be clearly tappable (44px target)
  - [x] 1.4: Password should be visible (not masked) — the whole point is easy access
- [x] Task 2: Wire up clipboard + toast integration (AC: #2)
  - [x] 2.1: Import `copyToClipboard` from `src/utils/clipboard.js` and `useToast` from `src/contexts/ToastContext.jsx`
  - [x] 2.2: On Copy button tap: call `copyToClipboard(password)`, on success call `showToast('Copied!')`
  - [x] 2.3: Handle clipboard failure gracefully (some browsers may block clipboard in non-HTTPS or non-secure context) — no error toast needed, just don't crash
- [x] Task 3: Add WifiCard to HomeTab (AC: #1)
  - [x] 3.1: Import and render `WifiCard` in `src/pages/HomeTab.jsx` below the Uber/Maps buttons section

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline
- **No new npm dependencies**

### Existing Components & Utilities to Reuse
- `Card` from `src/components/Card.jsx` — `{ Card }` named export, props: `{ children, className, interactive }`
- `copyToClipboard(text)` from `src/utils/clipboard.js` — async, returns `true`/`false`
- `useToast()` from `src/contexts/ToastContext.jsx` — returns `{ showToast }`, call `showToast('Copied!')`

### Data Access
```js
import tripData from '../../data/trip.json'
const { trip } = tripData

trip.airbnb.wifi.network   // "CasaRoma_Guest"
trip.airbnb.wifi.password  // "bienvenidos2026"
```

### UX Design Requirements
- Wifi card sits below the Uber/Maps buttons on the Home tab
- Card uses standard warm-gray bg (via `Card` component)
- Network name: regular weight, with wifi emoji (📶) prefix
- Password: displayed in monospace or bold for readability
- Copy button: visible, tappable (44px min target), can use terracotta text or teal bg
- "Copied!" toast: already handled by the Toast system — just call `showToast('Copied!')`

### Component Pattern
```jsx
import { Card } from '../Card'
import { copyToClipboard } from '../../utils/clipboard'
import { useToast } from '../../contexts/ToastContext'
import tripData from '../../data/trip.json'

export function WifiCard() {
  const { showToast } = useToast()
  const { wifi } = tripData.trip.airbnb

  const handleCopy = async () => {
    const ok = await copyToClipboard(wifi.password)
    if (ok) showToast('Copied!')
  }

  return (
    <Card>
      {/* Network name + password + copy button */}
    </Card>
  )
}
```

### File Structure
```
src/
  components/
    home/
      WifiCard.jsx        # NEW — wifi network + password + copy button
  pages/
    HomeTab.jsx           # MODIFY — add WifiCard import and render
```

### Previous Story Intelligence (Stories 2.1, 2.2)
- HomeTab.jsx at this point contains: hero photo, trip countdown, address, Uber/Maps buttons, check-in/out card
- WifiCard should go below the Uber/Maps buttons but above or alongside the check-in/check-out card (per UX wireframe: wifi card, then check-in/out card)
- The `src/components/home/` directory was created in Story 2.1 for TripCountdown — WifiCard goes in the same directory
- Toast system is fully functional — just import `useToast` and call `showToast`
- Clipboard utility returns boolean — check it before showing toast

### What NOT to Do
- Do NOT mask the password — it should be fully visible for easy reading
- Do NOT create a new toast system — use the existing `useToast()` hook
- Do NOT create a new clipboard utility — use existing `copyToClipboard()`
- Do NOT install any npm packages
- Do NOT use TypeScript
- Do NOT modify trip.json

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.1 Home Tab] — Wifi card layout with Copy button
- [Source: _bmad-output/planning-artifacts/architecture.md#7.2 Clipboard with Feedback] — Clipboard utility pattern
- [Source: _bmad-output/implementation-artifacts/1-5-toast-system-and-shared-interactions.md] — Toast and clipboard implementation details

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No test framework configured — verification via Vercel preview deploy

### Completion Notes List

- Created WifiCard component with network name, visible password, and Copy button (44px tap target, terracotta text)
- Integrated existing `copyToClipboard` utility and `useToast` hook — Copy triggers "Copied!" toast on success
- Clipboard failure handled gracefully (async/await with boolean check, no crash on failure)
- Added WifiCard to HomeTab between Uber/Maps buttons and check-in/out card per UX wireframe

### Change Log

- 2026-04-08: Story 2.3 implemented — Wifi card with tap-to-copy password and toast feedback

### File List

- src/components/home/WifiCard.jsx (new — wifi network + password + copy button component)
- src/pages/HomeTab.jsx (modified — added WifiCard import and render)
