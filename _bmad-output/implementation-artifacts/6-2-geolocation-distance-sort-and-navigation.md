# Story 6.2: Geolocation, Distance Sort & Navigation

Status: ready-for-dev

## Story

As a **family member**,
I want to see which curated places are closest to me and get directions with one tap,
So that I can explore the neighborhood without planning ahead.

## Acceptance Criteria

1. **Given** the Explore tab loads for the first time **When** the tab renders **Then** the browser requests GPS permission via `navigator.geolocation.getCurrentPosition` (single fetch, no auto-refresh)
2. **Given** GPS permission is granted **When** the user's position is received **Then** places are sorted by distance (nearest first) using haversine calculation
3. **And** distance in miles is displayed right-aligned in muted terracotta on each card
4. **And** a subtitle reads "Sorted by distance from you"
5. **Given** GPS permission is denied or unavailable **When** the tab renders **Then** places are sorted alphabetically
6. **And** no distance values are shown
7. **And** the subtitle reads "Sorted alphabetically"
8. **Given** any place card **When** the user taps the "Navigate" button **Then** the preferred maps app opens (Apple Maps on iOS, Google Maps on Android/desktop) with directions to that place's lat/lng

## Tasks / Subtasks

- [ ] Task 1: Create useGeolocation hook (AC: #1)
  - [ ] Create `src/hooks/useGeolocation.js`
  - [ ] Call `navigator.geolocation.getCurrentPosition` once on mount
  - [ ] Return `{ position: {lat, lng} | null, error: string | null, loading: boolean }`
  - [ ] Single fetch only — no watchPosition, no polling, no auto-refresh
  - [ ] Handle permission denied gracefully (set error, position stays null)

- [ ] Task 2: Create haversine distance utility (AC: #2, #3)
  - [ ] Create `src/utils/distance.js`
  - [ ] Export `getDistanceMiles(lat1, lng1, lat2, lng2)` function
  - [ ] Returns distance in miles using haversine formula
  - [ ] Reference implementation in architecture doc section 7.1

- [ ] Task 3: Integrate geolocation into ExploreTab (AC: #1, #2, #3, #4, #5, #6, #7)
  - [ ] Import and call `useGeolocation` hook in ExploreTab
  - [ ] Request geolocation ONLY when Explore tab mounts (not on app init)
  - [ ] When position available: sort places by distance (nearest first), show distance on each card
  - [ ] When position unavailable: sort places alphabetically by name
  - [ ] Update subtitle text: "Sorted by distance from you" vs "Sorted alphabetically"
  - [ ] Show loading state while geolocation resolving (brief spinner or "Getting your location...")

- [ ] Task 4: Display distance on place cards (AC: #3, #6)
  - [ ] Distance right-aligned in muted terracotta (`text-terracotta/70` or similar)
  - [ ] Format: "0.3 mi" — one decimal place
  - [ ] Only show distance when GPS position is available
  - [ ] Hide distance entirely when GPS denied (no "N/A" or placeholder)

- [ ] Task 5: Verify NavigateButton works on all cards (AC: #8)
  - [ ] NavigateButton already implemented in Story 6.1 — verify it renders on every card
  - [ ] Confirm Apple Maps on iOS, Google Maps on Android/desktop via existing `getNavigateUrl`

## Dev Notes

### Existing Components — Build On Story 6.1
Story 6.1 builds the ExploreTab with place cards and category filtering. This story ADDS geolocation sorting and distance display ON TOP of that work. Do not rewrite what 6.1 created — extend it.

### Files to Create
- `src/hooks/useGeolocation.js` — New custom hook (first hook in the project, creates `src/hooks/` directory)
- `src/utils/distance.js` — Haversine distance calculation

### Files to Modify
- `src/pages/ExploreTab.jsx` — Add geolocation integration, distance sorting, distance display

### Haversine Implementation (from Architecture Doc)
```js
export function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const toRad = (deg) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### Geolocation API Pattern
```js
// Single fetch, no watch — per architecture doc section 4.3
navigator.geolocation.getCurrentPosition(
  (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
  (err) => setError(err.message),
  { enableHighAccuracy: false, timeout: 10000 }
);
```

### Sorting Logic
```
if (userPosition) {
  // Sort by haversine distance, nearest first
  places.sort((a, b) => getDistanceMiles(userPos.lat, userPos.lng, a.lat, a.lng)
                       - getDistanceMiles(userPos.lat, userPos.lng, b.lat, b.lng));
} else {
  // Alphabetical fallback
  places.sort((a, b) => a.name.localeCompare(b.name));
}
```

### Styling for Distance Display (from UX Design)
- Distance: right-aligned on the card, muted terracotta color
- Format: "0.3 mi" (1 decimal, always in miles)
- Position: same line as place name, pushed to the right (flex with justify-between or similar)

### Subtitle States
| GPS State | Subtitle Text |
|-----------|--------------|
| Loading | "📍 Getting your location..." |
| Granted | "📍 Sorted by distance from you" |
| Denied/Error | "Sorted alphabetically" |

### Project Structure Notes
- `src/hooks/` directory does NOT exist yet — this story creates it
- Follow naming convention: `useGeolocation.js` (camelCase with `use` prefix)
- `src/utils/distance.js` follows existing utils pattern (camelCase)
- No new npm dependencies needed — uses native Geolocation API

### Anti-Patterns — DO NOT
- Do NOT use `watchPosition` — single fetch only per architecture spec
- Do NOT request geolocation on app init — only when Explore tab mounts
- Do NOT show distance as "N/A" when GPS denied — hide it entirely
- Do NOT add a "retry" button for GPS — graceful degradation to alphabetical
- Do NOT use a geolocation library — native browser API only
- Do NOT auto-refresh location — single fetch per tab mount
- Do NOT add TypeScript or new dependencies

### Dependencies on Story 6.1
This story assumes 6.1 is complete and the following exist:
- `ExploreTab.jsx` with place card rendering and category filtering
- `CategoryFilter.jsx` component
- Place cards using `Card` and `NavigateButton` components
- Category filtering via useState

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 6, Story 6.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#4.3 Geolocation]
- [Source: _bmad-output/planning-artifacts/architecture.md#7.1 Haversine Distance]
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.3 Explore Tab]
- [Source: _bmad-output/planning-artifacts/project-context.md#Dependencies Philosophy]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
