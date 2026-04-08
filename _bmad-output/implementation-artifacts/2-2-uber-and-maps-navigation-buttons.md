# Story 2.2: Uber & Maps Navigation Buttons

Status: review

## Story

As a **family member**,
I want one-tap directions to the Airbnb via Uber or Maps,
So that I can get back without copying addresses or asking for help.

## Acceptance Criteria

1. **Given** the Home tab is displayed **When** the user views the Airbnb card **Then** two side-by-side buttons appear: "Open in Uber" and "Open in Maps" (48px tall, teal bg, white text)
2. **Given** the user taps "Open in Uber" **When** Uber app is installed **Then** Uber opens with pickup at current location and dropoff at the Airbnb lat/lng
3. **When** Uber app is NOT installed **Then** the mobile Uber web URL opens as fallback
4. **Given** the user taps "Open in Maps" **When** the user is on iOS **Then** Apple Maps opens with directions to the Airbnb lat/lng
5. **When** the user is on Android or desktop **Then** Google Maps opens with directions to the Airbnb lat/lng

## Tasks / Subtasks

- [x] Task 1: Create Uber deep link utility (AC: #2, #3)
  - [x] 1.1: Add `getUberUrl(lat, lng, name)` to `src/utils/deeplinks.js` — returns the Uber deep link URL
  - [x] 1.2: Uber native deep link: `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
  - [x] 1.3: Uber web fallback: `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
  - [x] 1.4: Strategy: use the web fallback URL directly (it redirects to the app if installed, otherwise opens mobile web). This avoids broken `uber://` links on devices without the app.
- [x] Task 2: Add navigation buttons to HomeTab (AC: #1, #4, #5)
  - [x] 2.1: Add two side-by-side buttons below the address in HomeTab: "Open in Uber" and "Open in Maps"
  - [x] 2.2: Button styling: 48px height, teal bg (`bg-teal`), white text, rounded, full-width within a 2-column grid (`grid grid-cols-2 gap-3`)
  - [x] 2.3: "Open in Maps" uses existing `getNavigateUrl(lat, lng)` from `src/utils/deeplinks.js`
  - [x] 2.4: "Open in Uber" uses new `getUberUrl(lat, lng, name)` from `src/utils/deeplinks.js`
  - [x] 2.5: Both buttons open in new tab: `<a href={url} target="_blank" rel="noopener noreferrer">`

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline
- **No new npm dependencies**
- **No animation library**

### Existing Utilities to Reuse
- `getNavigateUrl(lat, lng)` from `src/utils/deeplinks.js` — already exists, returns Apple Maps on iOS / Google Maps on Android
- Platform detection already in deeplinks.js: `const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)`

### Deep Link Specifications (from Architecture)
```js
// Uber web fallback (preferred — handles app-installed and not-installed)
`https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`

// Maps (already implemented in getNavigateUrl)
// iOS: https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d
// Android/Web: https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}
```

### Data Access
```js
import tripData from '../data/trip.json'
const { trip } = tripData

trip.airbnb.lat   // 19.4178
trip.airbnb.lng   // -99.1634
trip.airbnb.name  // "Casa Roma - Charming Courtyard Apartment"
```

### UX Design Requirements (UX-DR5)
- Two buttons side-by-side, equal weight
- 48px tall (`min-h-[48px]`)
- Teal background (`bg-teal`), white text (`text-white`)
- Bold text, rounded corners
- Car emoji for Uber, Map pin emoji for Maps (optional, per UX wireframe)

### Button Implementation Pattern
```jsx
<div className="grid grid-cols-2 gap-3">
  <a
    href={uberUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-center"
  >
    Open in Uber
  </a>
  <a
    href={mapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center min-h-[48px] bg-teal text-white font-bold rounded-lg text-center"
  >
    Open in Maps
  </a>
</div>
```

### File Structure
```
src/
  utils/
    deeplinks.js        # MODIFY — add getUberUrl() export
  pages/
    HomeTab.jsx          # MODIFY — add Uber + Maps buttons below address
```

### Previous Story Intelligence (Story 2.1)
- HomeTab.jsx will have been updated by Story 2.1 to show hero photo, trip name + countdown, address, and check-in/check-out card
- The buttons should go between the address and the wifi card area (wifi is Story 2.3)
- deeplinks.js already exports `getNavigateUrl(lat, lng)` — add `getUberUrl` as a second named export

### What NOT to Do
- Do NOT use the `uber://` native deep link scheme — it breaks on devices without Uber installed. Use the `m.uber.com` web URL which handles both cases.
- Do NOT create a separate component file for these buttons — they're simple enough to inline in HomeTab
- Do NOT modify the NavigateButton component (that's for event cards in the schedule, not for the home page Uber/Maps buttons which have different styling)
- Do NOT install any npm packages
- Do NOT use TypeScript

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#5. Deep Link Specifications] — Uber and Maps URL patterns
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.1 Home Tab] — Side-by-side button layout, 48px, teal bg
- [Source: _bmad-output/planning-artifacts/architecture.md#5.4 Platform Detection] — iOS detection pattern

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No test framework configured — verification via Vercel preview deploy

### Completion Notes List

- Added `getUberUrl(lat, lng, name)` to deeplinks.js — uses m.uber.com web fallback URL (handles both app-installed and not-installed cases)
- Added side-by-side Uber + Maps buttons to HomeTab below the address section
- Buttons: 48px min-height, teal bg, white bold text, 2-column grid layout, open in new tab

### Change Log

- 2026-04-08: Story 2.2 implemented — Uber and Maps navigation buttons on Home tab

### File List

- src/utils/deeplinks.js (modified — added getUberUrl export)
- src/pages/HomeTab.jsx (modified — added Uber + Maps button grid)
