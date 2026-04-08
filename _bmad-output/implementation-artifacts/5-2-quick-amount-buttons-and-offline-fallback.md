# Story 5.2: Quick-Amount Buttons & Offline Fallback

Status: review

## Story

As a **family member**,
I want to tap common peso amounts for a quick conversion, even without internet,
So that I can check prices on the go — like at a market stall with no signal.

## Acceptance Criteria

1. **Given** the converter is displayed **When** the user views the quick-amount section **Then** buttons for 100, 200, 500, and 1000 pesos are visible
2. **And** tapping a button populates the input with that amount and shows the USD conversion
3. **Given** the device is offline and a cached rate exists in localStorage **When** the Money tab loads **Then** the cached rate is used for conversions **And** "Last updated: [timestamp]" shows when the rate was last fetched
4. **Given** the device is offline and NO cached rate exists **When** the Money tab loads **Then** the converter still renders but displays a message indicating the rate is unavailable

## Tasks / Subtasks

- [ ] Task 1: Add Quick Amount Buttons to Converter (AC: #1, #2)
  - [ ] 1.1: Add a `QuickAmounts` section below the converter result in `src/components/currency/Converter.jsx`
  - [ ] 1.2: Render 4 buttons: $100, $200, $500, $1,000 — styled as pill buttons in a horizontal row (use `flex gap-2 justify-center`)
  - [ ] 1.3: Button styling: warm-gray bg, charcoal text, rounded-full, px-4 py-2, min-height 44px tap target, `active:scale-[0.98]` press effect
  - [ ] 1.4: On tap: set `amount` to the button value, force `direction` to `mxn-to-usd` (since these are peso amounts), display USD conversion
  - [ ] 1.5: Active/selected state: if the current amount matches a quick button value AND direction is MXN→USD, give that button teal bg + white text

- [ ] Task 2: Enhance offline handling in useExchangeRate (AC: #3, #4)
  - [ ] 2.1: In `src/hooks/useExchangeRate.js`, ensure the hook already handles offline gracefully (from Story 5.1) — this task verifies and enhances
  - [ ] 2.2: When using a cached rate (whether stale or fresh), always return the `lastUpdated` timestamp so the UI can display it
  - [ ] 2.3: When NO cached rate exists AND fetch fails, return `{ rate: null, lastUpdated: null, loading: false, error: 'No exchange rate available' }`

- [ ] Task 3: Add offline/error state to CurrencyTab (AC: #3, #4)
  - [ ] 3.1: In `src/components/currency/CurrencyTab.jsx`, handle `error` state from useExchangeRate
  - [ ] 3.2: If `rate` is null and `error` is set: show a Card with a friendly message like "Exchange rate unavailable — connect to the internet to fetch the latest rate" in muted charcoal text, centered
  - [ ] 3.3: If rate exists but is stale (offline using cached): show "Last updated: [timestamp]" — same display as online, no special warning needed (graceful degradation per UX spec)
  - [ ] 3.4: The converter should still render when rate is null but with inputs disabled and result showing "—"

## Dev Notes

### Previous Story Intelligence (Story 5.1)
- `src/hooks/useExchangeRate.js` — hook created in 5.1 with `{ rate, lastUpdated, loading, error }` return shape
- `src/components/currency/Converter.jsx` — converter component with `amount` + `direction` state, swap button, real-time conversion
- `src/components/currency/CurrencyTab.jsx` — tab wrapper with rate display, last updated timestamp, loading state
- `src/pages/MoneyTab.jsx` — thin wrapper that imports CurrencyTab
- **Design system tokens** all available: `terracotta`, `teal`, `cream`, `marigold`, `charcoal`, `warm-gray`, `rounded-card`, `shadow-card`
- **Card component:** `src/components/Card.jsx` — `children`, `className`, `interactive` props
- **Toast system:** available via `useToast().showToast(message)` if needed

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline
- **No new npm dependencies**
- **No animation library** — CSS transitions only
- **Components under 80 lines** — split if larger

### Offline Behavior (from Architecture + UX)
- Exchange rate API is cached by both localStorage (app-level) AND service worker (Workbox StaleWhileRevalidate)
- Offline indicator: show "Last updated: [timestamp]" in muted text — no error modals, no alarm
- If no rate available at all: inline status text, not a modal or overlay
- Per UX spec: "No error modals — graceful degradation with inline status text"

### Quick Amount UX Notes
- Buttons represent common MXN values travelers encounter (market prices, restaurant bills, taxi fares)
- Tapping a quick amount should feel instant — no loading, no animation, just updates the converter
- Per UX shared patterns: 44px min tap target, active:scale(0.98) press effect

### Project Structure Notes
- All currency components in `src/components/currency/`
- This story modifies existing files from 5.1, minimal new files needed

### References
- [Source: _bmad-output/planning-artifacts/architecture.md#4.2] Exchange rate offline fallback
- [Source: _bmad-output/planning-artifacts/ux-design.md#5] Offline indicator patterns — "No error modals — graceful degradation with inline status text"
- [Source: _bmad-output/planning-artifacts/epics.md#Epic5] Story 5.2 acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
