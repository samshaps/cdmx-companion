# Story 3.2: Today Auto-Select & Now/Next Indicators

Status: ready-for-dev

## Story

As a **family member**,
I want the app to show me today's schedule and highlight what's happening now,
So that I can glance at my phone and immediately know where to be.

## Acceptance Criteria

1. **Given** the current date matches one of the 5 trip days **When** the Schedule tab loads **Then** today's day pill is auto-selected
2. **Given** the current date does NOT match a trip day **When** the Schedule tab loads **Then** the first day (Thursday) is selected by default
3. **Given** today is selected and there are events with future times **When** the events render **Then** the first event whose time hasn't passed gets a "NEXT" badge (light-teal outline)
4. **And** the preceding event (if within a 2-hour window) gets a "NOW" badge (marigold bg, bold white text)
5. **Given** all events for today have passed **When** the events render **Then** no NOW/NEXT badges are shown

## Tasks / Subtasks

- [ ] Task 1: Create useCurrentDay hook (AC: #1, #2)
  - [ ] 1.1: Create `src/hooks/useCurrentDay.js` — compares `new Date()` against itinerary dates
  - [ ] 1.2: Returns the index of today's itinerary entry, or 0 if no match
  - [ ] 1.3: Compare using date strings only (YYYY-MM-DD) — ignore timezone by constructing date at noon
- [ ] Task 2: Create useNowNext hook (AC: #3, #4, #5)
  - [ ] 2.1: Create `src/hooks/useNowNext.js` — accepts events array and selectedDayDate
  - [ ] 2.2: Only compute NOW/NEXT when selectedDayDate matches today
  - [ ] 2.3: Find the first future event (time hasn't passed) → mark as "next"
  - [ ] 2.4: Check preceding event — if within 2-hour window of current time → mark as "now"
  - [ ] 2.5: Return `{ nowIndex, nextIndex }` — both can be -1 if no badges apply
- [ ] Task 3: Add NOW/NEXT badges to EventCard (AC: #3, #4)
  - [ ] 3.1: Add optional `badge` prop to `EventCard` — accepts "now", "next", or null
  - [ ] 3.2: NOW badge: `bg-marigold text-white font-bold` pill, text "NOW"
  - [ ] 3.3: NEXT badge: `border border-teal-light text-teal-light` outline pill, text "NEXT"
  - [ ] 3.4: Badge renders above or at the top-left of the event card
- [ ] Task 4: Integrate into ScheduleTab (AC: #1-#5)
  - [ ] 4.1: Use `useCurrentDay(itinerary)` to set initial `selectedDay` state
  - [ ] 4.2: Use `useNowNext(events, selectedDayDate)` to get badge assignments
  - [ ] 4.3: Pass `badge` prop to each `EventCard` based on nowIndex/nextIndex

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline
- **State management:** React useState + custom hooks
- **No new npm dependencies**
- **No timezone libraries** — use `new Date()` device local time

### Now/Next Logic (from Architecture spec)
```
Uses device local time via new Date() — no timezone library needed.
Compare current time against itinerary events for the current day.
First event whose time hasn't passed = "Next"
The one before it (if within 2hr window) = "Now"
Updates on schedule tab load — no live polling.
```

**Implementation detail:**
```js
// Convert event time "14:00" to today's Date object for comparison
function eventToDate(timeStr, dateStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date(dateStr + 'T12:00:00') // noon to avoid TZ issues
  d.setHours(h, m, 0, 0)
  return d
}

// "Within 2-hour window" means: now is between (event.time) and (event.time + 2hrs)
```

### useCurrentDay Hook Spec
```js
// Input: itinerary array from trip.json
// Output: index of today's entry, or 0 if not a trip day
function useCurrentDay(itinerary) {
  const today = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  const idx = itinerary.findIndex(day => day.date === today)
  return idx >= 0 ? idx : 0
}
```

### Badge Visual Spec (from UX Design)
- **NOW badge:** Marigold background (#E8A838), bold white text, eye-catching but not alarming
- **NEXT badge:** Light-teal outline (#4ECDC4), visually secondary to NOW
- Both: small pill/tag shape, positioned at top of card or inline with card header

### Previous Story Context (Story 3.1)
Story 3.1 creates:
- `src/components/schedule/DaySelector.jsx` — day pill selector
- `src/components/schedule/EventCard.jsx` — event display card
- `src/pages/ScheduleTab.jsx` — main schedule page with `useState(0)` for selectedDay

This story modifies:
- `ScheduleTab.jsx` — change initial state from `0` to `useCurrentDay()` result, add useNowNext
- `EventCard.jsx` — add `badge` prop for NOW/NEXT display

### File Structure
New files:
```
src/hooks/
  useCurrentDay.js   # Determines which day to auto-select
  useNowNext.js      # Computes NOW/NEXT event indices
```

Modified files:
```
src/pages/ScheduleTab.jsx              # Use hooks for auto-select and badges
src/components/schedule/EventCard.jsx  # Add badge rendering
```

### What NOT to Do
- Do NOT add Navigate button — that's Story 3.3
- Do NOT display personalNote — that's Story 3.3
- Do NOT poll/auto-refresh the NOW/NEXT state — compute once on render
- Do NOT use moment.js, date-fns, or any date library — native Date only
- Do NOT modify trip.json
- Do NOT install new packages

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#4.4 Now/Next Indicator] — Logic spec
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.2 Schedule Tab] — Badge visual design
- [Source: _bmad-output/planning-artifacts/project-context.md] — Code style, hooks naming convention

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
