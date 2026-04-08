# Project Context: CDMX Family Trip Companion

## Project Type
- Greenfield PWA — single-page React application
- Weekend vibe-coding project, not enterprise software
- Prioritize speed of development and delight over robustness

## Technical Preferences

### Code Style
- JavaScript (no TypeScript — keep it light)
- Functional components with hooks only (no class components)
- Named exports for components, default export for pages/tabs
- Keep components small — if it's over 80 lines, split it

### Styling
- Tailwind CSS utility classes inline
- CSS variables for the color palette (defined in index.css)
- No separate CSS files per component
- Mobile-first responsive approach

### State Management
- React useState and useContext only — no Redux, no Zustand
- Trip data imported as static JSON — no state management needed for it
- Only dynamic state: active tab, geolocation, exchange rate, UI toggles

### File Conventions
- Components: PascalCase (e.g., `AirbnbCard.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useGeolocation.js`)
- Utils: camelCase (e.g., `distance.js`)
- One component per file

### Dependencies Philosophy
- Minimize dependencies — every npm package is a liability for a small project
- Prefer native browser APIs over libraries (Geolocation, Clipboard, Speech)
- Tailwind is the only styling dependency
- No animation library — CSS transitions and keyframes only

## Design Tokens

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

## Content Management
- All trip data lives in `src/data/trip.json`
- To update the trip: edit the JSON, push to GitHub, Vercel auto-deploys
- Places data is manually curated (70 places, 4 categories: eat, drink, see, shop)
- Phrase book is a curated static list with phonetic pronunciations

## Deployment
- Vercel (connected to GitHub repo)
- No environment variables needed
- No build-time secrets
