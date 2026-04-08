# Story 4.1: Phrase Book with Category Tabs

Status: ready-for-dev

## Story

As a **family member**,
I want to browse Spanish phrases organized by situation,
So that I can quickly find what to say at a restaurant, when shopping, or in an emergency.

## Acceptance Criteria

1. **Given** the user taps the Phrases tab **When** the tab renders **Then** category filter tabs are displayed: Greetings, Restaurant, Directions, Shopping, Emergency
2. **And** tapping a category filters the phrase list to that category
3. **And** each phrase card shows: English text, Spanish text, and phonetic pronunciation
4. **And** cards follow the design system (warm-gray bg, 16px radius, card shadow)
5. **And** an "Open Google Translate" link is visible at the bottom of the tab, opening `translate.google.com` with English→Spanish pre-set

## Tasks / Subtasks

- [ ] Task 1: Build PhrasesTab page component (AC: #1, #2, #5)
  - [ ] 1.1: Replace placeholder in `src/pages/PhrasesTab.jsx` with full implementation
  - [ ] 1.2: Import phrases from `trip.json` and implement category state (`useState`)
  - [ ] 1.3: Render category filter pills — horizontal row, teal fill active / outline inactive, matching day-pill visual pattern from UX spec
  - [ ] 1.4: Filter phrases by selected category; default to "greetings" on load
  - [ ] 1.5: Add "Open Google Translate" link at the bottom — opens `https://translate.google.com/?sl=en&tl=es` in new tab
- [ ] Task 2: Create PhraseCard component (AC: #3, #4)
  - [ ] 2.1: Create `src/components/phrases/PhraseCard.jsx` — shows English (bold), Spanish (teal), phonetic (italic muted)
  - [ ] 2.2: Use existing `Card` component as container with `interactive` prop
  - [ ] 2.3: Ensure minimum 44px tap target, generous padding for older users

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes — no separate CSS files
- **State:** React `useState` only — no context needed for local filter state
- **Components:** Functional components with hooks. Named exports.
- **No new npm dependencies**

### Existing Components to Reuse
- `Card` component (`src/components/Card.jsx`) — `{ children, className, interactive }` — warm-gray bg, rounded-card, shadow-card, p-4. Use `interactive` prop for tap feedback.
- `TabBar` pattern (`src/components/TabBar.jsx`) — reference for how pills/tabs are styled (terracotta active state). Category pills should use similar structure but with teal fill (matching day-pill pattern from UX spec).

### Data Structure (from trip.json)
```js
// Import: import tripData from '../data/trip.json'
// Access: tripData.phrases (array of 29 phrases)
// Each phrase: { category, english, spanish, phonetic }
// Categories: "greetings" (7), "restaurant" (7), "directions" (5), "shopping" (5), "emergency" (5)
```

### Category Filter Pill Styling
- Active: `bg-teal text-white` (solid teal fill, white text) — matches day-pill active state from Schedule tab UX spec
- Inactive: `border border-teal text-teal bg-transparent` (outline only)
- Use horizontal scrollable row with `flex gap-2 overflow-x-auto`
- Each pill: `px-4 py-2 rounded-full text-sm font-medium min-h-[44px]` (44px tap target)

### PhraseCard Layout
```
+--------------------------------------+
|  English text (bold, charcoal)       |
|  Spanish text (teal, medium weight)  |
|  phonetic (italic, muted charcoal)   |
+--------------------------------------+
```

### Google Translate Link
- URL: `https://translate.google.com/?sl=en&tl=es`
- Style: teal text, centered, at bottom of tab
- Opens in new tab: `target="_blank" rel="noopener noreferrer"`

### File Structure
New files:
```
src/components/phrases/PhraseCard.jsx   # Phrase display card
```

Files to modify:
```
src/pages/PhrasesTab.jsx               # Full implementation replacing placeholder
```

### Design System Tokens Available
- Colors: `terracotta`, `teal` (DEFAULT + light), `cream`, `marigold`, `charcoal`, `warm-gray`
- Utilities: `rounded-card` (16px), `shadow-card`, `font-display`, `font-sans` (DM Sans)
- Card: warm-gray bg on cream page background

### What NOT to Do
- Do NOT install any new npm packages
- Do NOT use TypeScript
- Do NOT implement tap-to-hear pronunciation (that's Story 4.2)
- Do NOT modify `trip.json`
- Do NOT modify `tailwind.config.js`
- Do NOT create a separate CategoryFilter component — keep it inline in PhrasesTab for simplicity (only 5 categories)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — File organization
- [Source: _bmad-output/planning-artifacts/architecture.md#5.5. Google Translate] — Outbound link URL
- [Source: _bmad-output/planning-artifacts/ux-design.md#5. Shared Interaction Patterns] — Button/pill styling

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
