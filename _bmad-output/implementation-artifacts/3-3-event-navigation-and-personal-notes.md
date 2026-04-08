# Story 3.3: Event Navigation & Personal Notes

Status: ready-for-dev

## Story

As a **family member**,
I want to tap any event to get directions, and see the organizer's personal tips,
So that I can navigate there easily and enjoy the insider recommendations.

## Acceptance Criteria

1. **Given** an event card with a location (lat/lng) **When** the user taps the "Navigate" button **Then** the preferred maps app opens (Apple Maps on iOS, Google Maps on Android/desktop) with directions to the event's lat/lng
2. **Given** an event has a personalNote field (non-empty string) **When** the event card renders **Then** the personal note is displayed in italic, muted color, with speech bubble styling — like a whispered aside from the organizer
3. **Given** an event does NOT have a personalNote (empty string) **When** the event card renders **Then** no personal note section is shown (no empty space)

## Tasks / Subtasks

- [ ] Task 1: Add NavigateButton to EventCard (AC: #1)
  - [ ] 1.1: Import existing `NavigateButton` from `src/components/NavigateButton.jsx`
  - [ ] 1.2: Render `<NavigateButton lat={lat} lng={lng} />` at the bottom-right of each event card
  - [ ] 1.3: Only show if lat/lng are present and valid (non-zero)
  - [ ] 1.4: NavigateButton already handles platform detection (iOS → Apple Maps, else → Google Maps)
- [ ] Task 2: Add personal notes display to EventCard (AC: #2, #3)
  - [ ] 2.1: Check `event.personalNote` — only render if truthy (non-empty string)
  - [ ] 2.2: Style: italic text, muted/lighter color (`text-charcoal/60` or similar)
  - [ ] 2.3: Speech bubble visual treatment — use a subtle background (`bg-cream` or `bg-warm-gray/50`), small rounded corners, slight left indent or speech tail indicator
  - [ ] 2.4: Prefix with 💬 emoji to indicate organizer's personal note
- [ ] Task 3: Verify layout coherence
  - [ ] 3.1: Ensure Navigate button and personal note don't conflict visually
  - [ ] 3.2: Layout: event info → personal note (if any) → Navigate button (right-aligned at bottom)
  - [ ] 3.3: Card should not feel cluttered — maintain generous padding

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline
- **No new npm dependencies**
- **No new components** — this story only modifies `EventCard.jsx`

### Existing NavigateButton Component
Already created in Story 1.5 at `src/components/NavigateButton.jsx`:
```jsx
import { getNavigateUrl } from '../utils/deeplinks'

export function NavigateButton({ lat, lng }) {
  const url = getNavigateUrl(lat, lng)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-terracotta font-medium min-h-[44px] min-w-[44px] px-3 py-2 ml-auto"
    >
      🧭 Navigate
    </a>
  )
}
```
- Uses `getNavigateUrl(lat, lng)` from `src/utils/deeplinks.js`
- Platform detection: iOS → Apple Maps, else → Google Maps
- Already right-aligned via `ml-auto`, terracotta text, 44px tap target

### Personal Note Design (from UX Design spec)
- **Style:** Italic, slightly muted color — "like a whispered aside from the organizer"
- **Treatment:** Speech bubble styling
- **Visual reference from UX wireframe:**
  ```
  Speech "Mom — the courtyard is gorgeous"
  Speech "Get there early, fills up!"
  ```

### Recommended Personal Note Implementation
```jsx
{personalNote && (
  <div className="mt-2 flex items-start gap-2 bg-cream/60 rounded-lg px-3 py-2">
    <span>💬</span>
    <p className="text-sm italic text-charcoal/60">{personalNote}</p>
  </div>
)}
```

### EventCard Layout Order (after this story)
```
┌─────────────────────────────────┐
│ [badge]                         │  ← NOW/NEXT (from 3.2)
│ 🍽️  7:30 PM                    │  ← category emoji + time
│ Dinner at Contramar             │  ← event name
│ "Iconic seafood spot..."        │  ← notes/description
│                                 │
│ 💬 "Get there early, fills up!" │  ← personal note (this story)
│                                 │
│                    🧭 Navigate  │  ← navigate button (this story)
└─────────────────────────────────┘
```

### Previous Story Context
Stories 3.1 and 3.2 create the `EventCard` component. This story adds two features to it:
- **NavigateButton** — import and render at bottom of card
- **personalNote display** — conditional render between notes and navigate button

The `event` object is already passed as props to EventCard. The `lat`, `lng`, and `personalNote` fields are available.

### File Structure
Modified files only:
```
src/components/schedule/EventCard.jsx  # Add NavigateButton + personal notes
```

No new files needed.

### What NOT to Do
- Do NOT create a new NavigateButton — reuse the existing one
- Do NOT modify NavigateButton.jsx or deeplinks.js — they work as-is
- Do NOT install new packages
- Do NOT modify trip.json
- Do NOT add new state management — this is purely presentational

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.2 Schedule Tab] — Personal note styling, Navigate placement
- [Source: _bmad-output/planning-artifacts/architecture.md#5. Deep Link Specifications] — Maps URLs (handled by existing deeplinks.js)
- [Source: _bmad-output/implementation-artifacts/1-5-toast-system-and-shared-interactions.md] — NavigateButton spec

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
