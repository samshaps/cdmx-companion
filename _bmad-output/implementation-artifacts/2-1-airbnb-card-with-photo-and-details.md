# Story 2.1: Airbnb Card with Photo & Details

Status: review

## Story

As a **family member**,
I want to see the Airbnb info — photo, name, address, and check-in times — all in one place,
So that I don't have to dig through texts to find where we're staying.

## Acceptance Criteria

1. **Given** the user taps the Home tab **When** the Home tab renders **Then** a full-width hero photo of the Airbnb displays at the top, bleeding to edges (no horizontal padding on the image)
2. **And** the trip name "La Familia CDMX" is displayed with a countdown ("5 days away!" pre-trip, or "Day 2 of 5!" during trip) in marigold accent
3. **And** the property address is displayed below
4. **And** check-in time (3:00 PM) and check-out time (11:00 AM) are displayed in a card
5. **And** all text uses the design system fonts and colors

## Tasks / Subtasks

- [x] Task 1: Replace HomeTab.jsx with real Home tab content (AC: #1-5)
  - [x] 1.1: Remove the existing placeholder/design-system showcase content from `src/pages/HomeTab.jsx`
  - [x] 1.2: Add full-width hero image using `trip.airbnb.photo` (`/images/airbnb.jpg`) — image should bleed to edges (no `px-4` on the image container, apply padding only below)
  - [x] 1.3: Add trip name display with `font-display text-3xl` and countdown component inline
  - [x] 1.4: Add property address below the trip name in `text-charcoal/70`
- [x] Task 2: Create TripCountdown component (AC: #2)
  - [x] 2.1: Create `src/components/home/TripCountdown.jsx` — calculates days until trip or current trip day using `trip.dates.start` and `trip.dates.end`
  - [x] 2.2: Pre-trip: display "X days away!" in marigold text
  - [x] 2.3: During trip: display "Day X of 5!" in marigold text
  - [x] 2.4: Post-trip: display nothing or a subtle "Trip complete" message
  - [x] 2.5: Use `new Date()` for current date — no timezone library needed (dates are YYYY-MM-DD strings, compare date portions only)
- [x] Task 3: Create check-in/check-out card (AC: #4)
  - [x] 3.1: Add a `Card` component section showing check-in (3:00 PM) and check-out (11:00 AM) times from `trip.airbnb.checkIn` and `trip.airbnb.checkOut`
  - [x] 3.2: Use clock emoji or icon prefix, display times side-by-side or stacked in the card

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline — no separate CSS files
- **Components:** Functional components with hooks. Named exports for reusable components, default export for HomeTab (page-level).
- **Keep components small** — under 80 lines, split if larger
- **No new npm dependencies**

### Existing Components to Reuse
- `Card` from `src/components/Card.jsx` — named export `{ Card }`, props: `{ children, className, interactive }`
- `NavigateButton` from `src/components/NavigateButton.jsx` — named export, props: `{ lat, lng }` (NOT needed for this story, but available for 2.2)

### Data Access Pattern
```js
import tripData from '../data/trip.json'  // or '../../data/trip.json' from components/home/
const { trip } = tripData

// Airbnb data
trip.airbnb.name       // "Casa Roma - Charming Courtyard Apartment"
trip.airbnb.address    // "Calle Orizaba 142, Roma Norte, Cuauhtémoc, 06700 CDMX"
trip.airbnb.photo      // "/images/airbnb.jpg"
trip.airbnb.checkIn    // "3:00 PM"
trip.airbnb.checkOut   // "11:00 AM"
trip.airbnb.lat        // 19.4178
trip.airbnb.lng        // -99.1634

// Trip dates
trip.dates.start       // "2026-05-14"
trip.dates.end         // "2026-05-18"
trip.name              // "La Familia CDMX"
```

### Trip Countdown Logic
```js
// Trip is 5 days: May 14 (Thu) through May 18 (Mon)
const today = new Date()
const start = new Date(trip.dates.start + 'T00:00:00')  // Avoid timezone shift
const end = new Date(trip.dates.end + 'T00:00:00')

// Pre-trip: "5 days away!"
// During: "Day 2 of 5!"  (day 1 = start date)
// Post-trip: hide or "Trip complete"
const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1  // = 5
```

### UX Design Requirements (UX-DR5)
- Hero photo: full-width bleed, no side padding on image
- Trip countdown: marigold accent text (`text-marigold font-bold`)
- Trip name: display font (`font-display`), large (`text-3xl` or `text-2xl`)
- Address: muted charcoal (`text-charcoal/70`), smaller text
- Check-in/out card: use `Card` component with warm-gray bg
- Overall page background: cream (already set globally)
- Content below the hero image should have horizontal padding (`px-4`)

### File Structure
```
src/
  pages/
    HomeTab.jsx              # MODIFY — replace placeholder with real content
  components/
    home/
      TripCountdown.jsx      # NEW — countdown display component
```

**IMPORTANT:** The `src/components/home/` directory may not exist yet. Create it.

### Previous Story Intelligence (Epic 1)
- App.jsx imports HomeTab as default import: `import HomeTab from './pages/HomeTab'`
- Card component uses named export: `import { Card } from '../components/Card'`
- Tailwind custom colors available: `terracotta`, `teal`, `teal-light`, `cream`, `marigold`, `charcoal`, `warm-gray`
- Tailwind custom utilities: `rounded-card`, `shadow-card`, `font-display`, `font-sans`
- Build output ~67KB gzipped — well under 80KB budget
- No `/images/airbnb.jpg` file exists yet in `public/images/` — use a placeholder or ensure the image path works gracefully if missing (show a colored background fallback)

### What NOT to Do
- Do NOT add Uber/Maps buttons (that's Story 2.2)
- Do NOT add wifi card (that's Story 2.3)
- Do NOT install any npm packages
- Do NOT use TypeScript
- Do NOT modify trip.json
- Do NOT modify App.jsx routing — HomeTab is already wired up
- Do NOT remove the `max-w-md mx-auto` container pattern if keeping centered layout

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.1 Home Tab] — Hero photo, countdown, layout
- [Source: _bmad-output/planning-artifacts/architecture.md#4.1 Static Trip Data] — Data imported at build time
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — File organization
- [Source: _bmad-output/planning-artifacts/project-context.md] — Code style, component conventions

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No test framework configured — verification via Vercel preview deploy

### Completion Notes List

- Replaced HomeTab placeholder with full Home tab: hero photo, trip name + countdown, address, check-in/out card
- Created TripCountdown component with pre-trip ("X days away!"), during-trip ("Day X of 5!"), and post-trip states
- Hero image uses onError fallback (hides img) with teal-tinted bg container as graceful degradation
- Check-in/out displayed side-by-side in a Card with uppercase labels

### Change Log

- 2026-04-08: Story 2.1 implemented — Airbnb card with hero photo, trip countdown, address, check-in/out times

### File List

- src/components/home/TripCountdown.jsx (new — trip countdown display component)
- src/pages/HomeTab.jsx (modified — replaced placeholder with full Home tab content)
