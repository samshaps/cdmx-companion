# Story 6.1: Place Cards with Category Filter

Status: ready-for-dev

## Story

As a **family member**,
I want to browse the organizer's curated places and filter by what I'm in the mood for,
So that I can find a great restaurant, bar, or sight without Googling.

## Acceptance Criteria

1. **Given** the user taps the Explore tab **When** the tab renders **Then** all curated places are displayed as cards showing: category emoji, name, address, and the organizer's note in quotes with warm-gray background
2. **And** a category filter bar appears at the top with pills: All, Eat, Drink, See, Shop
3. **And** "All" is selected by default
4. **And** tapping a category pill filters the list to that category (teal fill when active, outline when inactive)
5. **And** cards have generous padding for easy tapping through a long scrollable list

## Tasks / Subtasks

- [ ] Task 1: Build ExploreTab page component (AC: #1, #5)
  - [ ] Replace the existing stub in `src/pages/ExploreTab.jsx`
  - [ ] Import `tripData` from `src/data/trip.json` and extract `places` array
  - [ ] Render place cards using the existing `Card` component from `src/components/Card.jsx`
  - [ ] Each card displays: category emoji, place name, address, organizer note in quotes
  - [ ] Organizer note styled with warm-gray background, italic, quoted text — personal feel
  - [ ] Include `NavigateButton` from `src/components/NavigateButton.jsx` on each card with lat/lng
  - [ ] Cards must have generous padding (min 44px tap targets)

- [ ] Task 2: Build CategoryFilter component (AC: #2, #3, #4)
  - [ ] Create `src/components/CategoryFilter.jsx`
  - [ ] Render horizontal pill buttons: All, Eat, Drink, See, Shop
  - [ ] Category-to-emoji mapping: eat → 🍽️, drink → 🍺, see → 👁️, shop → 🛍️
  - [ ] Active pill: `bg-teal text-white` (teal fill); inactive: `border border-teal text-teal` (outline)
  - [ ] "All" selected by default via parent state
  - [ ] Accept `activeCategory` and `onCategoryChange` props from parent

- [ ] Task 3: Wire filtering logic in ExploreTab (AC: #4)
  - [ ] `useState` for `activeCategory`, default `"all"`
  - [ ] Filter `places` array: if `activeCategory === "all"` show all, else filter by `place.category`
  - [ ] Render filtered list

## Dev Notes

### Existing Components to Reuse — DO NOT Recreate
- **`src/components/Card.jsx`** — Reusable card with `bg-warm-gray rounded-card shadow-card p-4`. Props: `children`, `className`, `interactive` (adds scale animation). USE THIS for place cards.
- **`src/components/NavigateButton.jsx`** — Takes `lat` and `lng` props, opens Apple Maps (iOS) or Google Maps. USE THIS on every place card.
- **`src/contexts/ToastContext.jsx`** — `useToast()` → `showToast("message")`. Available if needed.

### Data Structure (from `src/data/trip.json`)
```json
{
  "name": "string",
  "category": "eat" | "drink" | "see" | "shop",
  "lat": number,
  "lng": number,
  "address": "string",
  "note": "string"
}
```
Access via: `import tripData from '../data/trip.json'` → `tripData.places`

### Category Emoji Mapping
| Category | Emoji | Filter Label |
|----------|-------|-------------|
| all | — | All |
| eat | 🍽️ | Eat |
| drink | 🍺 | Drink |
| see | 👁️ | See |
| shop | 🛍️ | Shop |

### Styling Requirements (from UX Design)
- Page header: `font-display text-2xl font-bold text-charcoal` (matches other tabs)
- Subtitle: "Sorted alphabetically" (distance sorting comes in Story 6.2)
- Category pills: same visual treatment as Schedule tab day pills — teal fill active, outline inactive
- Organizer notes: in quotes, warm-gray background, italic — personal handwritten-note feel
- Navigate button: right-aligned on each card, terracotta text, 44px tap target (handled by NavigateButton component)
- Distance display: NOT in this story — comes in 6.2

### Project Structure Notes
- Tab pages live in `src/pages/` (NOT `src/components/explore/` as architecture doc suggests)
- ExploreTab.jsx already exists as a stub at `src/pages/ExploreTab.jsx` — replace contents
- Already imported and registered in `src/App.jsx` TAB_COMPONENTS
- New `CategoryFilter.jsx` goes in `src/components/` (flat structure, no subfolders)
- JavaScript only — no TypeScript
- Functional components with hooks, named exports for components, default export for tab pages

### Tab Page Pattern (from existing tabs)
```jsx
export default function ExploreTab() {
  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-charcoal text-center">
        Explore
      </h1>
      {/* content */}
    </div>
  )
}
```

### Anti-Patterns — DO NOT
- Do NOT create a `src/components/explore/` subfolder — flat component structure
- Do NOT add any new npm dependencies
- Do NOT implement geolocation or distance sorting — that's Story 6.2
- Do NOT use TypeScript
- Do NOT create separate CSS files — Tailwind utility classes only
- Do NOT use Redux/Zustand — useState only

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 6, Story 6.1]
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.3 Explore Tab]
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure]
- [Source: _bmad-output/planning-artifacts/project-context.md#Code Style]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
