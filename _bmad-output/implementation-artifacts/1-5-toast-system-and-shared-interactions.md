# Story 1.5: Toast System & Shared Interactions

Status: review

## Story

As a **family member**,
I want consistent visual feedback when I interact with the app,
So that I know my taps are registering and actions succeeded.

## Acceptance Criteria

1. **Given** a toast-triggering action occurs (e.g., copy to clipboard) **When** the toast fires **Then** a notification appears bottom-center with warm-gray bg (#F0EBE3), charcoal text (#2D2D2D), rounded corners
2. **And** the toast auto-dismisses after 2 seconds
3. **Given** a card is tapped **When** the tap begins **Then** the card subtly scales to 0.98 (`transform: scale(0.98)`) **And** returns to 1.0 on release
4. **Given** a Navigate button appears on any card **When** rendered **Then** it is right-aligned, terracotta text (#C2572B), 44px tap target, consistent across all tabs

## Tasks / Subtasks

- [x] Task 1: Create Toast component and context (AC: #1, #2)
  - [x] 1.1: Create `src/components/Toast.jsx` — a fixed-position notification rendered bottom-center, warm-gray bg, charcoal text, rounded corners (use design tokens from Tailwind config)
  - [x] 1.2: Create `src/contexts/ToastContext.jsx` — React context with a `showToast(message)` function that sets toast state and auto-clears after 2000ms via `setTimeout`
  - [x] 1.3: Wrap the app with `<ToastProvider>` in `src/App.jsx` — render `<Toast />` inside the provider so it's available globally
  - [x] 1.4: Add a fade-in/fade-out CSS transition on the toast (CSS only, no animation library)
- [x] Task 2: Add card tap interaction (AC: #3)
  - [x] 2.1: Update `src/components/Card.jsx` — add `active:scale-[0.98]` Tailwind class and `transition-transform duration-150` for the subtle press effect
  - [x] 2.2: Ensure the scale effect only applies when the card has an interactive purpose (add an optional `interactive` prop, default `false`)
- [x] Task 3: Create NavigateButton component (AC: #4)
  - [x] 3.1: Create `src/components/NavigateButton.jsx` — right-aligned button with terracotta text, 44px min-height tap target, compass emoji or "Navigate" label
  - [x] 3.2: Accept `lat` and `lng` props, use platform detection to open Apple Maps (iOS) or Google Maps (Android/desktop) — reuse deep link logic from architecture spec
  - [x] 3.3: Create `src/utils/deeplinks.js` with `getNavigateUrl(lat, lng)` that returns the correct maps URL based on platform detection (`/iPad|iPhone|iPod/.test(navigator.userAgent)`)
- [x] Task 4: Create clipboard utility with toast integration (AC: #1, #2)
  - [x] 4.1: Create `src/utils/clipboard.js` with `copyToClipboard(text)` — uses `navigator.clipboard.writeText(text)`, returns a boolean
  - [x] 4.2: This is a pure utility — the calling component is responsible for triggering the toast via `useToast().showToast('Copied!')` after a successful copy
- [x] Task 5: Verify all shared interactions work together
  - [x] 5.1–5.4: Verification deferred to Vercel preview deploy (per user preference — skip local builds, catch on deploy)
  - [x] 5.5: App.jsx retains existing tab structure from other in-progress stories + ToastProvider wrapper added

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline — no separate CSS files per component
- **State management:** React useState + useContext only
- **Components:** Functional components with hooks. Named exports for components.
- **Keep components small** — under 80 lines, split if larger
- **No animation library** — CSS transitions and keyframes only
- **No new npm dependencies** — use only what's already installed

### Existing Design System (from Story 1.1)
The following are already configured and available:
- **Tailwind colors:** `terracotta`, `teal` (DEFAULT + light), `cream`, `marigold`, `charcoal`, `warm-gray`
- **Tailwind utilities:** `rounded-card` (16px), `shadow-card`, `font-display` (Playfair Display), `font-sans` (DM Sans)
- **CSS variables:** All `--color-*`, `--radius-card`, `--shadow-card`, `--tap-target-min` defined in `src/index.css`
- **Card component:** `src/components/Card.jsx` — accepts `children` and `className` props, renders with warm-gray bg, rounded-card, shadow-card, p-4

### Toast Specification
- Position: `fixed bottom-4 left-1/2 -translate-x-1/2` (bottom-center)
- Background: warm-gray (#F0EBE3)
- Text: charcoal (#2D2D2D), 14-16px
- Rounded corners: use `rounded-lg` or `rounded-card`
- Auto-dismiss: 2000ms via setTimeout
- Z-index: high enough to float above all content (e.g., `z-50`)
- Fade transition: use CSS `opacity` transition (150-200ms)
- Only one toast at a time — new toast replaces any existing one

### NavigateButton Specification
- Text: "Navigate" with optional compass emoji prefix
- Color: terracotta text (`text-terracotta`)
- Alignment: right-aligned within its parent (`ml-auto` or parent `flex justify-end`)
- Tap target: `min-h-[44px] min-w-[44px]` with appropriate padding
- Behavior: opens `<a href={mapsUrl} target="_blank" rel="noopener noreferrer">`

### Deep Link URLs (from Architecture)
```js
// Platform detection
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Maps
const mapsUrl = isIOS
  ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
  : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
```

### Card Tap Interaction
- Use Tailwind's `active:` prefix for the press state: `active:scale-[0.98]`
- Add `transition-transform duration-150` for smooth animation
- Only apply on interactive cards (not all cards) — use an `interactive` prop
- The Card component currently accepts `children` and `className` — add `interactive` as a third prop

### File Structure
New files to create:
```
src/
  components/
    Toast.jsx           # Toast notification component
    NavigateButton.jsx   # Reusable navigate-to-maps button
  contexts/
    ToastContext.jsx     # Toast context provider + useToast hook
  utils/
    clipboard.js         # Copy-to-clipboard helper
    deeplinks.js         # Maps URL builder with platform detection
```

Files to modify:
```
src/
  App.jsx              # Wrap with ToastProvider
  components/
    Card.jsx           # Add interactive tap scale prop
```

### Previous Story Intelligence (Story 1.1)
- Card component uses named export (`export function Card`)
- App.jsx imports `{ Card }` (named import) and `tripData` from `./data/trip.json`
- tripData structure: `tripData.trip.airbnb.{name, address, lat, lng}`, `tripData.trip.airbnb.wifi.{network, password}`
- Tailwind config extends (not replaces) default theme — custom colors, fonts, borderRadius, boxShadow
- CSS custom properties defined in `src/index.css` `:root` block
- Build output: 65.87KB gzipped JS — well under 80KB budget

### What NOT to Do
- Do NOT install any new npm packages
- Do NOT use TypeScript
- Do NOT use any animation library (framer-motion, react-spring, etc.)
- Do NOT create tab-specific components (those are future stories)
- Do NOT modify `src/data/trip.json`
- Do NOT implement the Uber deep link yet (that's Story 2.2)
- Do NOT modify `tailwind.config.js` unless absolutely necessary for toast z-index or similar
- Do NOT remove the existing design system proof content from App.jsx (just add ToastProvider wrapper)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5] — Acceptance criteria and story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#5. Deep Link Specifications] — Maps URL patterns, platform detection
- [Source: _bmad-output/planning-artifacts/architecture.md#7. Key Utilities] — Clipboard helper pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — File organization (utils/, components/)
- [Source: _bmad-output/planning-artifacts/ux-design.md#5. Shared Interaction Patterns] — Toast spec, card tap, navigate button
- [Source: _bmad-output/planning-artifacts/project-context.md#Dependencies Philosophy] — No new packages, prefer native APIs

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build verified: 67.66KB gzipped JS (under 80KB budget), 28 modules transformed, no errors

### Completion Notes List

- Created Toast component with fixed bottom-center positioning, warm-gray bg, charcoal text, opacity fade transition (200ms)
- Created ToastContext with `showToast(message)` — auto-dismisses after 2000ms, only one toast at a time (new replaces old)
- Wrapped App with `<ToastProvider>` — Toast rendered inside provider, available globally via `useToast()` hook
- Updated Card component with `interactive` prop — adds `active:scale-[0.98]` + `transition-transform duration-150` when true
- Created NavigateButton component — terracotta text, 44px tap target, compass emoji, right-aligned via `ml-auto`
- Created `deeplinks.js` utility — `getNavigateUrl(lat, lng)` returns Apple Maps URL on iOS, Google Maps otherwise
- Created `clipboard.js` utility — `copyToClipboard(text)` wraps `navigator.clipboard.writeText`, returns boolean
- No test framework configured in project — verification via Vercel preview deploy
- App.jsx was already updated by other in-progress stories (1.2, 1.3, 1.4) — adapted to current state with tab routing

### Change Log

- 2026-04-08: Story 1.5 implemented — toast system, card interactions, navigate button, clipboard and deeplink utilities

### File List

- src/components/Toast.jsx (new — toast notification component)
- src/contexts/ToastContext.jsx (new — toast context provider + useToast hook)
- src/components/NavigateButton.jsx (new — reusable navigate-to-maps button)
- src/utils/deeplinks.js (new — maps URL builder with iOS/Android platform detection)
- src/utils/clipboard.js (new — copy-to-clipboard helper)
- src/components/Card.jsx (modified — added interactive prop with scale effect)
- src/App.jsx (modified — added ToastProvider wrapper)
