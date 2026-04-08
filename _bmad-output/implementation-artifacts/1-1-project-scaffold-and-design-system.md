# Story 1.1: Project Scaffold & Design System

Status: review

## Story

As a **trip organizer**,
I want a solid project foundation with the design system in place,
So that all future features look and feel consistent from day one.

## Acceptance Criteria

1. **Given** a fresh project **When** `npm run dev` is executed **Then** a Vite + React + Tailwind app starts with no errors
2. **And** Tailwind config includes all 7 design tokens: Terracotta (#C2572B), Deep Teal (#1A535C), Warm Cream (#FFF5E6), Marigold (#E8A838), Charcoal (#2D2D2D), Light Teal (#4ECDC4), Warm Gray (#F0EBE3)
3. **And** Playfair Display (display) and DM Sans (body) fonts are loaded
4. **And** base card styles use 16px rounded corners, shadow `0 2px 12px rgba(0,0,0,0.08)`, warm-gray bg
5. **And** body text is minimum 16px, touch targets minimum 44px
6. **And** `src/data/trip.json` contains seed data matching the PRD schema (airbnb, itinerary, places, phrases)
7. **And** page background is Warm Cream (#FFF5E6)

## Tasks / Subtasks

- [x] Task 1: Initialize Vite + React project (AC: #1)
  - [x] 1.1: Run `npm create vite@latest` with React template (JavaScript, NOT TypeScript) in the project root
  - [x] 1.2: Verify `npm run dev` starts without errors
  - [x] 1.3: Clean up Vite boilerplate (remove default App.css content, logo references, demo markup)
- [x] Task 2: Install and configure Tailwind CSS (AC: #1, #2, #7)
  - [x] 2.1: Install Tailwind CSS v3+ with PostCSS and Autoprefixer
  - [x] 2.2: Create `tailwind.config.js` with custom theme extending colors for all 7 tokens
  - [x] 2.3: Add Tailwind directives (`@tailwind base/components/utilities`) to the main CSS file
  - [x] 2.4: Define CSS custom properties in `src/index.css` for the design tokens (see Dev Notes)
  - [x] 2.5: Set page background to Warm Cream (#FFF5E6) on `body` or root element
- [x] Task 3: Configure typography — Google Fonts (AC: #3, #5)
  - [x] 3.1: Add Playfair Display and DM Sans via Google Fonts `<link>` tags in `index.html`
  - [x] 3.2: Set DM Sans as the default body font in Tailwind config `fontFamily`
  - [x] 3.3: Add Playfair Display as `fontFamily.display` in Tailwind config
  - [x] 3.4: Set base body font-size to 16px minimum
- [x] Task 4: Establish base card and interaction styles (AC: #4, #5)
  - [x] 4.1: Create a reusable Card component (`src/components/Card.jsx`) with: warm-gray bg (#F0EBE3), 16px rounded corners, shadow `0 2px 12px rgba(0,0,0,0.08)`, generous padding
  - [x] 4.2: Add utility classes or CSS for 44px minimum tap targets (`--tap-target-min: 44px`)
  - [x] 4.3: Verify card renders correctly on the page with warm-gray on cream background
- [x] Task 5: Verify seed data exists (AC: #6)
  - [x] 5.1: Confirm `src/data/trip.json` exists and matches the PRD schema with: `trip.airbnb`, `itinerary[]`, `places[]`, `phrases[]` structures
  - [x] 5.2: Verify the JSON can be imported in a React component without errors
- [x] Task 6: Create minimal App shell with design system proof (AC: all)
  - [x] 6.1: Update `src/App.jsx` to render a placeholder page that demonstrates the design system: cream background, a sample Card, correct fonts, correct colors
  - [x] 6.2: Verify Playfair Display renders for a heading element
  - [x] 6.3: Verify DM Sans renders for body text
  - [x] 6.4: Confirm the app runs cleanly with `npm run dev` — no console errors

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript. This is explicitly specified in architecture and project-context.
- **Build tool:** Vite 5+ with React template
- **Styling:** Tailwind CSS 3+ (utility-first, inline classes)
- **State management:** React useState/useContext only — no Redux, no Zustand
- **Components:** Functional components with hooks only. Named exports for components, default export for pages/tabs.
- **Keep components small** — under 80 lines, split if larger.

### Design System Tokens

CSS custom properties to define in `src/index.css`:

```css
:root {
  --color-terracotta: #C2572B;
  --color-teal: #1A535C;
  --color-cream: #FFF5E6;
  --color-marigold: #E8A838;
  --color-charcoal: #2D2D2D;
  --color-light-teal: #4ECDC4;
  --color-warm-gray: #F0EBE3;
  --radius-card: 16px;
  --shadow-card: 0 2px 12px rgba(0,0,0,0.08);
  --tap-target-min: 44px;
}
```

Tailwind config color mapping:

```js
colors: {
  terracotta: '#C2572B',
  teal: { DEFAULT: '#1A535C', light: '#4ECDC4' },
  cream: '#FFF5E6',
  marigold: '#E8A838',
  charcoal: '#2D2D2D',
  'warm-gray': '#F0EBE3',
}
```

### Typography

- **Playfair Display** — display/header font (warm serif). Use for trip name, tab titles, section headers.
- **DM Sans** — body font (clean sans-serif). Default for all content text.
- Load via Google Fonts `<link>` in `index.html` — no npm font packages.
- Minimum body text: 16px. Minimum tap target: 44px (48px for primary CTAs).

### File Structure (from Architecture)

Follow this exact structure for files created in this story:

```
src/
  main.jsx             # Entry point (exists from Vite scaffold)
  App.jsx              # App shell (exists from Vite scaffold, needs updating)
  index.css            # Global styles with CSS variables + Tailwind directives
  data/
    trip.json          # Already exists with seed data
  components/
    Card.jsx           # Reusable card component
```

### Styling Approach
- Tailwind CSS utility classes inline — NO separate CSS files per component
- CSS variables for the color palette defined in `index.css`
- Mobile-first responsive approach
- No animation library — CSS transitions and keyframes only

### Dependencies to Install
- `tailwindcss` (v3+)
- `postcss`
- `autoprefixer`
- These are the ONLY new dependencies. Do NOT add any other packages.

### What NOT to Do
- Do NOT use TypeScript — the architecture explicitly specifies JavaScript (JSX)
- Do NOT install any animation libraries
- Do NOT add Redux, Zustand, or any state management library
- Do NOT create PWA configuration yet (that's Story 1.3)
- Do NOT create the TabBar component (that's Story 1.2)
- Do NOT create any tab content components beyond the proof-of-concept App shell
- Do NOT modify `src/data/trip.json` — it already has valid seed data

### Project Structure Notes

- This is a greenfield project with only `src/data/trip.json` existing
- The Vite scaffold will create `main.jsx`, `App.jsx`, etc. — clean up boilerplate after scaffolding
- `index.html` is at the project root (Vite convention)
- All component files use `.jsx` extension, hooks/utils use `.js`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#2. Tech Stack] — Vite 5+, React 18+, Tailwind 3+, JavaScript JSX
- [Source: _bmad-output/planning-artifacts/architecture.md#3. Project Structure] — Full file tree
- [Source: _bmad-output/planning-artifacts/ux-design.md#2. Design System] — Color palette, typography, card specs
- [Source: _bmad-output/planning-artifacts/project-context.md#Design Tokens] — CSS custom properties
- [Source: _bmad-output/planning-artifacts/project-context.md#Technical Preferences] — Code style, file conventions, dependencies philosophy
- [Source: _bmad-output/planning-artifacts/PRD.md#5. Data Architecture] — trip.json schema

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build verified: 65.87KB gzipped JS bundle (under 80KB budget)
- Dev server starts in ~982ms with no errors

### Completion Notes List

- Scaffolded Vite 8 + React 19 project with JavaScript (JSX) template
- Installed Tailwind CSS v3.4.19 with PostCSS and Autoprefixer as dev dependencies
- Configured all 7 design tokens in both Tailwind config (colors) and CSS custom properties
- Google Fonts loaded via `<link>` tags: Playfair Display (display) + DM Sans (body/default sans)
- Created reusable Card component with warm-gray bg, 16px rounded corners, card shadow
- App shell demonstrates design system: cream background, Card component, both font families, all 7 color swatches
- trip.json seed data confirmed valid and importable (used in App shell to display Airbnb name/address)
- All 7 acceptance criteria satisfied
- No test framework configured — this is a greenfield scaffold story; testing infrastructure not yet specified in architecture

### Change Log

- 2026-04-08: Story 1.1 implemented — project scaffold with full design system

### File List

- index.html (new — Vite entry with Google Fonts)
- package.json (new — Vite + React + Tailwind deps)
- vite.config.js (new — Vite config with React plugin)
- postcss.config.js (new — PostCSS with Tailwind + Autoprefixer)
- tailwind.config.js (new — custom theme with all design tokens)
- eslint.config.js (new — from Vite scaffold)
- .gitignore (new — node_modules, dist, editor files)
- src/main.jsx (new — React entry point)
- src/App.jsx (new — design system proof app shell)
- src/index.css (new — Tailwind directives + CSS custom properties)
- src/components/Card.jsx (new — reusable card component)
