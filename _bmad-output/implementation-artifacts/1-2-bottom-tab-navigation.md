# Story 1.2: Bottom Tab Navigation

Status: review

## Story

As a **family member**,
I want a clear tab bar at the bottom of the screen,
So that I can quickly jump to any section without getting lost.

## Acceptance Criteria

1. **Given** the app is open **When** the page loads **Then** a bottom tab bar displays 5 tabs: Home, Schedule, Phrases, Money, Explore
2. **And** each tab has a label below its icon
3. **And** the active tab shows a terracotta underline accent
4. **And** tapping a tab switches content with a CSS fade transition
5. **And** the tab bar is always visible (never hides on scroll)
6. **And** the Home tab is active by default on load
7. **And** tab bar buttons meet 44px minimum tap target

## Tasks / Subtasks

- [x] Task 1: Create TabBar component (AC: #1, #2, #3, #5, #7)
  - [x] 1.1: Create `src/components/TabBar.jsx` with 5 tab buttons (Home, Schedule, Phrases, Money, Explore)
  - [x] 1.2: Add inline SVG icons for each tab (simple, lightweight — no icon library)
  - [x] 1.3: Render label text below each icon
  - [x] 1.4: Style active tab with terracotta (#C2572B) underline accent (2-3px border-bottom)
  - [x] 1.5: Style inactive tabs with charcoal/50 opacity for icon+label
  - [x] 1.6: Ensure each tab button is minimum 44px tap target (use `min-h-[44px] min-w-[44px]`)
  - [x] 1.7: Fix tab bar to bottom of viewport with `fixed bottom-0 left-0 right-0` — sits above page content
  - [x] 1.8: Tab bar background: white or warm-gray with a top border/shadow to separate from content
- [x] Task 2: Create placeholder tab content components (AC: #4, #6)
  - [x] 2.1: Create `src/pages/HomeTab.jsx` — move current App.jsx content here (trip name, airbnb card, design system card)
  - [x] 2.2: Create `src/pages/ScheduleTab.jsx` — placeholder with tab name
  - [x] 2.3: Create `src/pages/PhrasesTab.jsx` — placeholder with tab name
  - [x] 2.4: Create `src/pages/MoneyTab.jsx` — placeholder with tab name
  - [x] 2.5: Create `src/pages/ExploreTab.jsx` — placeholder with tab name
- [x] Task 3: Implement tab switching in App.jsx (AC: #4, #6)
  - [x] 3.1: Add `useState` for `activeTab` defaulting to `'home'`
  - [x] 3.2: Render the active tab's content component based on state
  - [x] 3.3: Add CSS fade transition on content switch (use CSS `opacity` + `transition` — no animation library)
  - [x] 3.4: Add bottom padding to content area so it doesn't get hidden behind the fixed tab bar (`pb-20` or similar)
  - [x] 3.5: Pass `activeTab` and `setActiveTab` to TabBar component
- [x] Task 4: Verify all acceptance criteria (AC: all)
  - [x] 4.1: Confirm all 5 tabs render with icons + labels
  - [x] 4.2: Confirm terracotta underline on active tab
  - [x] 4.3: Confirm fade transition on tab switch
  - [x] 4.4: Confirm tab bar stays visible on scroll (test with overflowing content)
  - [x] 4.5: Confirm Home tab is active by default
  - [x] 4.6: Confirm 44px minimum tap targets on all tab buttons

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Components:** Functional components with hooks. Named exports for components (`TabBar`), default export for pages/tabs (`HomeTab`, etc.)
- **Styling:** Tailwind CSS utility classes inline — NO separate CSS files per component
- **State:** React `useState` only for active tab tracking — no routing library, no React Router
- **Icons:** Inline SVG icons — do NOT add any icon library (react-icons, heroicons npm package, etc.). Keep SVGs simple and lightweight.
- **Keep components under 80 lines** — split if larger

### Tab Configuration

The 5 tabs from UX design (UX-DR4):

| Tab      | Icon Concept     | Key        |
|----------|-----------------|------------|
| Home     | House/home      | `home`     |
| Schedule | Calendar        | `schedule` |
| Phrases  | Speech bubble   | `phrases`  |
| Money    | Dollar/currency | `money`    |
| Explore  | Compass/pin     | `explore`  |

### Visual Specifications (from UX Design)
- **Active tab:** Terracotta (#C2572B) icon color + terracotta underline accent (2-3px)
- **Inactive tabs:** Muted charcoal (#2D2D2D) at ~50% opacity
- **Tab bar:** Always visible, fixed to bottom. White or `bg-warm-gray` background. Subtle top border or shadow to separate from content.
- **Labels:** Below icons, small text (text-xs), same color treatment as icons (terracotta active, muted inactive)
- **Transition:** CSS fade transition between tab content — use `opacity` with `transition-opacity duration-200` or similar. CSS only, no animation library.

### File Structure

Create these new files:
```
src/
  components/
    TabBar.jsx       # Bottom tab bar (named export)
  pages/
    HomeTab.jsx      # Home content (default export) — gets current App.jsx content
    ScheduleTab.jsx  # Placeholder (default export)
    PhrasesTab.jsx   # Placeholder (default export)
    MoneyTab.jsx     # Placeholder (default export)
    ExploreTab.jsx   # Placeholder (default export)
```

Modify existing:
```
src/
  App.jsx            # Refactor: tab state + content area + TabBar
```

### Existing Code Patterns (from Story 1.1)
- `Card` component uses named export: `export function Card({ children, className = '' })`
- App.jsx uses default export: `export default App`
- Tailwind classes inline: `className="bg-cream px-4 py-8"`
- trip.json imported as: `import tripData from './data/trip.json'`
- Design tokens available in Tailwind: `bg-terracotta`, `text-teal`, `bg-warm-gray`, `bg-cream`, `text-charcoal`
- Custom Tailwind values: `rounded-card`, `shadow-card`, `font-display`

### Critical Implementation Details
- **No routing library.** Tab switching is pure React state — `useState('home')` and conditional rendering. Do NOT install or use React Router.
- **Fixed positioning.** Tab bar must use `fixed bottom-0` so it stays visible during scroll. Content area needs bottom padding to avoid being hidden under the tab bar.
- **Safe area inset.** Add `pb-safe` or `pb-[env(safe-area-inset-bottom)]` to the tab bar for iOS notch/home indicator. Add this as a style prop since Tailwind may not have the utility: `style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}`
- **Fade transition approach:** Wrap tab content in a div with `transition-opacity duration-200`. When switching tabs, briefly set opacity to 0, swap component, then back to 1. A simple approach: use a key on the content wrapper that changes with activeTab so React re-mounts with a CSS animation.

### What NOT to Do
- Do NOT install React Router or any routing package
- Do NOT install an icon library (react-icons, lucide-react, heroicons, etc.)
- Do NOT create the actual tab content yet (Airbnb hero, schedule, etc.) — just placeholders. Exception: HomeTab gets the current App.jsx demo content.
- Do NOT add PWA configuration (Story 1.3)
- Do NOT modify `src/data/trip.json`
- Do NOT modify `tailwind.config.js` unless strictly necessary
- Do NOT add any new npm dependencies

### Previous Story Intelligence (Story 1.1)
- Project scaffolded with Vite 8 + React 19 (not 18 as architecture says — React 19 is installed)
- Tailwind CSS v3.4.19 configured with all 7 color tokens
- Card component established the pattern: named export, accepts `children` + `className` props, Tailwind utility classes
- Build produces 65.87KB gzipped (under 80KB budget) — tab navigation should add minimal bundle size
- Google Fonts loaded via `<link>` in index.html (Playfair Display + DM Sans)
- Current App.jsx content should move to HomeTab.jsx — it imports tripData and Card

### Project Structure Notes

- `src/pages/` directory does not exist yet — create it
- Follows architecture specification: pages/tabs get their own folder
- Component naming: PascalCase for `.jsx` files (TabBar.jsx, HomeTab.jsx)
- Architecture calls for a `src/pages/` or `src/tabs/` folder — use `src/pages/` to match architecture doc's file tree

### References

- [Source: _bmad-output/planning-artifacts/ux-design.md#Navigation] — Bottom tab bar spec, 5 tabs, terracotta underline
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — File tree with pages/ folder
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/project-context.md#Code Style] — Named exports for components, default for pages
- [Source: _bmad-output/planning-artifacts/architecture.md#UX-DR4] — Tab bar always visible, terracotta accent, labels below icons
- [Source: _bmad-output/planning-artifacts/architecture.md#UX-DR12] — Fade transitions between tabs (CSS only)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build verified: 67.66KB gzipped JS bundle (under 80KB budget)
- 28 modules transformed successfully

### Completion Notes List

- Created TabBar component with 5 inline SVG icons (home, calendar, speech bubble, dollar, compass)
- Active tab styled with terracotta underline accent (3px border-bottom) and terracotta icon/label color
- Inactive tabs use charcoal at 50% opacity
- Tab bar fixed to bottom with white bg, top border, z-50, and iOS safe area inset padding
- All tab buttons meet 44px minimum tap target (min-h-[44px] min-w-[44px])
- Moved existing App.jsx demo content to HomeTab.jsx (default export)
- Created 4 placeholder tab pages (Schedule, Phrases, Money, Explore) with "Coming soon" text
- Refactored App.jsx: useState('home') for tab state, conditional rendering via TAB_COMPONENTS map
- Added CSS fade-in animation (200ms) in index.css — triggered on tab switch via React key prop
- Content area has pb-20 to avoid being hidden behind fixed tab bar
- No new dependencies added — zero npm packages installed

### Change Log

- 2026-04-08: Story 1.2 implemented — bottom tab navigation with 5 tabs, fade transitions, fixed positioning

### File List

- src/components/TabBar.jsx (new — bottom tab bar with 5 SVG icon tabs)
- src/pages/HomeTab.jsx (new — home content moved from App.jsx)
- src/pages/ScheduleTab.jsx (new — placeholder)
- src/pages/PhrasesTab.jsx (new — placeholder)
- src/pages/MoneyTab.jsx (new — placeholder)
- src/pages/ExploreTab.jsx (new — placeholder)
- src/App.jsx (modified — tab state management + TabBar + content switching)
- src/index.css (modified — added fade-in keyframe animation)
