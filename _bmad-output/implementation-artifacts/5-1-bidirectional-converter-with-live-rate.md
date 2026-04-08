# Story 5.1: Bidirectional Converter with Live Rate

Status: review

## Story

As a **family member**,
I want to type an amount in pesos or dollars and instantly see the conversion,
So that I know what things cost without doing mental math.

## Acceptance Criteria

1. **Given** the user taps the Money tab **When** the tab renders **Then** a converter UI displays with an input field, a swap button to toggle direction, and the converted result
2. **And** the current exchange rate is fetched from the ExchangeRate API on load **And** the rate and a "Last updated: [timestamp]" are displayed
3. **And** typing a value updates the conversion in real-time
4. **Given** the user taps the swap button **When** the direction toggles **Then** the converter switches between USD→MXN and MXN→USD **And** any entered value is re-converted in the new direction
5. **Given** the cached rate is older than 4 hours **When** the Money tab loads **Then** a fresh rate is fetched from the API and cached in localStorage

## Tasks / Subtasks

- [ ] Task 1: Create `useExchangeRate` hook (AC: #2, #5)
  - [ ] 1.1: Create `src/hooks/useExchangeRate.js` — custom hook that returns `{ rate, lastUpdated, loading, error }`
  - [ ] 1.2: On mount, check localStorage for cached rate (`exchange_rate` key) with timestamp
  - [ ] 1.3: If cached rate exists AND is less than 4 hours old, use it (no fetch)
  - [ ] 1.4: If no cached rate or older than 4 hours, fetch from `https://open.er-api.com/v6/latest/USD`, extract `rates.MXN`, store rate + `Date.now()` timestamp in localStorage
  - [ ] 1.5: If fetch fails (network error, offline), fall back to cached rate if available; if no cache at all, set `error` state
  - [ ] 1.6: Return the rate as a number (e.g., 17.5 means 1 USD = 17.5 MXN)

- [ ] Task 2: Build Converter component (AC: #1, #3, #4)
  - [ ] 2.1: Create `src/components/currency/Converter.jsx` — the main converter UI
  - [ ] 2.2: State: `amount` (string, input value), `direction` ('usd-to-mxn' | 'mxn-to-usd')
  - [ ] 2.3: Input field: large numeric input (`type="text" inputMode="decimal"`) — styled with Tailwind, centered, large font (text-3xl or text-4xl)
  - [ ] 2.4: Swap button: centered between "from" and "to" labels, toggles `direction` state. Use `⇅` or swap arrows emoji. Teal bg, white text, rounded-full, min 44px tap target
  - [ ] 2.5: Converted result: displayed as read-only text below the swap button, same large font, with currency symbol prefix ($ for USD, MX$ for MXN)
  - [ ] 2.6: Conversion logic: if USD→MXN, result = amount × rate; if MXN→USD, result = amount / rate. Format to 2 decimal places.
  - [ ] 2.7: Show "from" currency label above input and "to" currency label above result, switching when direction toggles

- [ ] Task 3: Build CurrencyTab page (AC: #1, #2)
  - [ ] 3.1: Create `src/components/currency/CurrencyTab.jsx` — tab page wrapper
  - [ ] 3.2: Display tab title "Money" with `font-display text-2xl font-bold text-charcoal text-center` (matches existing tab title pattern)
  - [ ] 3.3: Render rate display: "1 USD = {rate} MXN" in a Card component, centered
  - [ ] 3.4: Render "Last updated: {timestamp}" in muted text below the rate (format: relative like "2 min ago" or absolute like "Today at 3:45 PM")
  - [ ] 3.5: Show loading spinner/text while rate is being fetched
  - [ ] 3.6: Render Converter component

- [ ] Task 4: Replace MoneyTab placeholder
  - [ ] 4.1: Update `src/pages/MoneyTab.jsx` to import and render `CurrencyTab` from `src/components/currency/CurrencyTab.jsx`
  - [ ] 4.2: Keep the page file thin — just re-exports the currency tab component (follows pattern of page files being thin wrappers)

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline — no separate CSS files per component
- **State management:** React useState + useEffect hooks. No external state libraries.
- **Components:** Functional components with hooks. Named exports for shared components.
- **Keep components small** — under 80 lines, split if larger
- **No animation library** — CSS transitions only
- **No new npm dependencies** — use only what's already installed

### Exchange Rate API
- **Endpoint:** `https://open.er-api.com/v6/latest/USD` (free, no API key)
- **Response shape:** `{ result: "success", rates: { MXN: 17.5, ... }, time_last_update_utc: "..." }`
- **Cache key in localStorage:** `exchange_rate` — store as JSON: `{ rate: number, timestamp: number }`
- **Cache TTL:** 4 hours (14400000 ms)
- **Service worker already caches this API** via Workbox StaleWhileRevalidate (configured in vite.config.js)

### Existing Design System (from Story 1.1)
- **Tailwind colors:** `terracotta`, `teal` (DEFAULT + light), `cream`, `marigold`, `charcoal`, `warm-gray`
- **Tailwind utilities:** `rounded-card` (16px), `shadow-card`, `font-display` (Playfair Display), `font-sans` (DM Sans)
- **Card component:** `src/components/Card.jsx` — accepts `children`, `className`, `interactive` props
- **Toast system:** `src/contexts/ToastContext.jsx` — `useToast().showToast(message)` available globally

### Project Structure Notes
- Page files live in `src/pages/` — thin wrappers that import from `src/components/`
- Component domain folders: `src/components/currency/` for currency-related components (per architecture spec)
- Hooks in `src/hooks/`
- No `src/hooks/` directory exists yet — will be created
- Existing pages pattern: `export default function TabName() { ... }` (default exports for pages)

### References
- [Source: _bmad-output/planning-artifacts/architecture.md#4.2] Exchange rate data flow
- [Source: _bmad-output/planning-artifacts/architecture.md#6] PWA config with exchange rate caching
- [Source: _bmad-output/planning-artifacts/ux-design.md#5] Offline indicator patterns
- [Source: _bmad-output/planning-artifacts/epics.md#Epic5] Story 5.1 acceptance criteria

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
