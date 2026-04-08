# Story 3.1: Day Selector & Event Cards

Status: ready-for-dev

## Story

As a **family member**,
I want to pick a day and see all events for that day,
So that I know exactly what's planned without scrolling through everything.

## Acceptance Criteria

1. **Given** the user taps the Schedule tab **When** the tab renders **Then** 5 day pills are displayed horizontally (Thu–Mon)
2. **And** arrival (Thu) and departure (Mon) pills show a plane emoji
3. **And** the active pill has teal fill with white text; inactive pills are outline only
4. **And** tapping a pill switches the displayed events (no slide animation, content swap)
5. **Given** each event for the selected day **When** displayed **Then** the event card shows: time, location name, description/notes, and category emoji
6. **And** each card has a 3px left border accent colored by category
7. **And** a day title (e.g., "Thursday — Arrival Day") appears above the event list

## Tasks / Subtasks

- [ ] Task 1: Create DaySelector component (AC: #1, #2, #3, #4)
  - [ ] 1.1: Create `src/components/schedule/DaySelector.jsx` — renders 5 horizontal pills from `itinerary` data
  - [ ] 1.2: Each pill shows abbreviated day name (Thu, Fri, Sat, Sun, Mon). First and last pills get ✈️ plane emoji
  - [ ] 1.3: Active pill: `bg-teal text-white`; Inactive: `border border-teal text-teal` (outline style)
  - [ ] 1.4: Accept `selectedIndex` and `onSelect(index)` props — parent controls state
- [ ] Task 2: Create EventCard component (AC: #5, #6)
  - [ ] 2.1: Create `src/components/schedule/EventCard.jsx` — displays time, name, notes, category emoji
  - [ ] 2.2: Category emoji map: `transit` → 🚗, `meal` → 🍽️, `activity` → 🎯, `free` → ☀️
  - [ ] 2.3: 3px left border colored by category: `transit` → charcoal, `meal` → terracotta, `activity` → teal, `free` → marigold
  - [ ] 2.4: Use existing `Card` component as the wrapper with `interactive` prop
  - [ ] 2.5: Time displayed in 12-hour format (convert from 24h `time` field in JSON)
- [ ] Task 3: Build ScheduleTab page (AC: #4, #7)
  - [ ] 3.1: Replace placeholder in `src/pages/ScheduleTab.jsx` with DaySelector + event list
  - [ ] 3.2: Import `itinerary` from `../data/trip.json` — access `tripData.itinerary`
  - [ ] 3.3: `useState` for `selectedDay` index (default: 0 — first day)
  - [ ] 3.4: Display day title above events: format as "Thursday — Arrival Day" using `dayTitle` from data
  - [ ] 3.5: Map selected day's `events` array to `EventCard` components

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline — no separate CSS files
- **State management:** React useState only — no context needed for this story
- **Components:** Functional components with hooks, named exports
- **Keep components small** — under 80 lines, split if larger
- **No new npm dependencies**

### Data Structure (from src/data/trip.json)
```json
{
  "itinerary": [
    {
      "date": "2026-05-14",        // ISO date string
      "dayTitle": "Arrival Day",    // Human-readable subtitle
      "events": [
        {
          "time": "12:30",          // 24-hour format
          "name": "Land at MEX Airport",
          "category": "transit",    // transit | meal | activity | free
          "lat": 19.4363,
          "lng": -99.0721,
          "notes": "Terminal 1...",
          "personalNote": ""        // Empty string = no note, non-empty = show note
        }
      ]
    }
    // ... 5 days total (Thu May 14 - Mon May 18)
  ]
}
```

**Import pattern:** `import tripData from '../data/trip.json'` then `tripData.itinerary`

### Category Visual Mapping
| Category | Emoji | Left Border Color | Tailwind Class |
|----------|-------|-------------------|----------------|
| transit  | 🚗    | Charcoal (#2D2D2D) | `border-l-charcoal` |
| meal     | 🍽️    | Terracotta (#C2572B) | `border-l-terracotta` |
| activity | 🎯    | Teal (#1A535C) | `border-l-teal` |
| free     | ☀️    | Marigold (#E8A838) | `border-l-marigold` |

### Time Formatting
Convert 24h time from JSON to 12h display:
```js
function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}
```

### Day Pill Formatting
The itinerary has 5 entries. Extract the day name from `date` field:
```js
const dayName = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
// "Thu", "Fri", "Sat", "Sun", "Mon"
```
Add ✈️ to index 0 (arrival) and index 4 (departure).

### Existing Components to Reuse
- `Card` from `src/components/Card.jsx` — wrap each event card. Use `interactive` prop for tap scale effect.
- **Do NOT use** `NavigateButton` yet — that's Story 3.3

### File Structure
New files to create:
```
src/components/schedule/
  DaySelector.jsx    # Horizontal day pill selector
  EventCard.jsx      # Individual event card with category styling
```

Files to modify:
```
src/pages/ScheduleTab.jsx  # Replace "Coming soon" placeholder
```

### Design Reference
- Day pills: same visual treatment as Explore category filter (teal fill active, outline inactive)
- Event cards: warm-gray bg, 16px rounded corners, card shadow, generous padding
- 3px left border accent is the distinguishing feature of schedule cards
- Day title uses `font-display` (Playfair Display), bold

### What NOT to Do
- Do NOT implement "Today" auto-select logic — that's Story 3.2
- Do NOT implement NOW/NEXT badges — that's Story 3.2
- Do NOT add Navigate button to event cards — that's Story 3.3
- Do NOT display personalNote — that's Story 3.3
- Do NOT install any new packages
- Do NOT modify trip.json
- Do NOT create custom hooks yet — simple useState is sufficient for this story
- Default to index 0 (first day) — do NOT try to detect "today"

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.2 Schedule Tab] — Visual design spec
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — File organization
- [Source: _bmad-output/planning-artifacts/architecture.md#4.1 Static Trip Data] — Data flow
- [Source: _bmad-output/planning-artifacts/project-context.md] — Code style, component conventions

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
