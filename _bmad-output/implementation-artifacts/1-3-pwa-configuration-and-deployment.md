# Story 1.3: PWA Configuration & Deployment

Status: ready-for-dev

## Story

As a **family member**,
I want to install the app on my home screen and have it work offline,
So that I can access trip info anytime, even without internet.

## Acceptance Criteria

1. **Given** the app is deployed to Vercel **When** a user opens the URL **Then** the PWA manifest includes name "La Familia CDMX", theme_color #1A535C, background_color #FFF5E6, display "standalone"
2. **And** PWA icons (192px and 512px) are present
3. **And** the service worker caches the app shell, JSON data, and static assets via Workbox
4. **And** the app works offline for core features (displays cached content)
5. **And** total bundle size is under 500KB (excluding images)
6. **And** the app loads under 3s on a 4G connection

## Tasks / Subtasks

- [ ] Task 1: Install and configure vite-plugin-pwa (AC: #1, #3)
  - [ ] 1.1: Install `vite-plugin-pwa` as a dev dependency — this is the ONLY new dependency
  - [ ] 1.2: Update `vite.config.js` to import `VitePWA` from `vite-plugin-pwa` and add it to the plugins array
  - [ ] 1.3: Configure the manifest object with exact values: `name: 'La Familia CDMX'`, `short_name: 'CDMX Trip'`, `description: 'Our family trip to Mexico City'`, `theme_color: '#1A535C'`, `background_color: '#FFF5E6'`, `display: 'standalone'`, `start_url: '/'`
  - [ ] 1.4: Set `registerType: 'autoUpdate'` so the service worker auto-updates without user prompt
  - [ ] 1.5: Configure Workbox `globPatterns: ['**/*.{js,css,html,json,png,jpg,svg,woff2}']` to precache the app shell and static assets
  - [ ] 1.6: Add runtime caching rule for the exchange rate API: `urlPattern: /^https:\/\/open\.er-api\.com/`, handler: `'StaleWhileRevalidate'`, cacheName: `'exchange-rate'`, maxAgeSeconds: `14400` (4 hours)
- [ ] Task 2: Create PWA icons (AC: #2)
  - [ ] 2.1: Create `public/icons/icon-192.png` — 192x192 app icon
  - [ ] 2.2: Create `public/icons/icon-512.png` — 512x512 app icon
  - [ ] 2.3: Reference both icons in the manifest `icons` array with correct `src`, `sizes`, and `type: 'image/png'`
  - [ ] 2.4: Add `purpose: 'any maskable'` to the 512px icon for Android adaptive icon support
- [ ] Task 3: Update index.html for PWA metadata (AC: #1)
  - [ ] 3.1: Add `<meta name="theme-color" content="#1A535C">` to `<head>`
  - [ ] 3.2: Add `<link rel="apple-touch-icon" href="/icons/icon-192.png">` for iOS home screen icon
  - [ ] 3.3: Add `<meta name="apple-mobile-web-app-capable" content="yes">` for iOS standalone support
  - [ ] 3.4: Add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` for iOS status bar
- [ ] Task 4: Verify build and bundle size (AC: #5, #6)
  - [ ] 4.1: Run `npm run build` and confirm it completes without errors
  - [ ] 4.2: Verify the service worker file is generated in the `dist/` output
  - [ ] 4.3: Check the manifest is generated in `dist/` with correct values
  - [ ] 4.4: Verify total JS bundle remains under 80KB gzipped (Story 1.1 reported 65.87KB — adding vite-plugin-pwa should add minimal overhead since Workbox is a build-time dependency)
  - [ ] 4.5: Run `npm run preview` and verify the service worker registers in browser DevTools (Application > Service Workers)
- [ ] Task 5: Deploy to Vercel preview (AC: all)
  - [ ] 5.1: Deploy to Vercel preview environment
  - [ ] 5.2: Verify PWA manifest loads correctly via DevTools (Application > Manifest)
  - [ ] 5.3: Verify service worker is active (Application > Service Workers)
  - [ ] 5.4: Test offline: enable airplane mode after first load, confirm cached content still displays
  - [ ] 5.5: Test installability: Chrome should show install prompt, Safari should allow Add to Home Screen

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Build tool:** Vite 5+ (currently Vite 8.0.4)
- **PWA plugin:** `vite-plugin-pwa` (latest) — uses Workbox under the hood
- **Hosting:** Vercel — free, instant deploys from Git, global CDN, HTTPS by default

### Exact PWA Configuration (from Architecture doc)

This is the exact configuration to implement in `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'La Familia CDMX',
        short_name: 'CDMX Trip',
        description: 'Our family trip to Mexico City',
        theme_color: '#1A535C',
        background_color: '#FFF5E6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/open\.er-api\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'exchange-rate',
              expiration: { maxAgeSeconds: 14400 }
            }
          }
        ]
      }
    })
  ]
})
```

### PWA Icons

- Icons go in `public/icons/` directory (create it — currently only `favicon.svg` and `icons.svg` exist in `public/`)
- 192px and 512px PNG icons required
- For a quick MVP, generate simple icons with the app's Deep Teal (#1A535C) background and white text "CDMX" or a Mexico flag emoji
- The 512px icon should include `purpose: 'any maskable'` for Android adaptive icon support
- iOS requires the `<link rel="apple-touch-icon">` tag in `index.html` pointing to the 192px icon

### iOS-Specific Meta Tags

iOS Safari needs additional meta tags for proper PWA behavior:
- `apple-mobile-web-app-capable` — enables standalone mode when launched from home screen
- `apple-mobile-web-app-status-bar-style` — `black-translucent` gives the best look with the cream background
- `apple-touch-icon` — specifies the home screen icon for iOS

### Current Project State (from Story 1.1)

Files that exist and will be modified:
- `vite.config.js` — currently only has the React plugin, needs VitePWA added
- `index.html` — needs PWA meta tags added to `<head>`
- `package.json` — `vite-plugin-pwa` will be added as dev dependency

Files that exist and should NOT be modified:
- `src/App.jsx` — current design system proof shell
- `src/components/Card.jsx` — reusable card component
- `src/data/trip.json` — seed data
- `src/index.css` — CSS variables and Tailwind directives
- `tailwind.config.js` — design system tokens

New files to create:
- `public/icons/icon-192.png` — 192px app icon
- `public/icons/icon-512.png` — 512px app icon

### Dependencies
- **ONLY** add `vite-plugin-pwa` (latest) as a devDependency
- Do NOT install Workbox separately — `vite-plugin-pwa` includes it
- Do NOT install any icon generation libraries — create icons manually or use a simple canvas approach

### What NOT to Do
- Do NOT create the iOS Safari onboarding overlay — that is Story 1.4
- Do NOT create the TabBar component — that is Story 1.2
- Do NOT implement the toast system — that is Story 1.5
- Do NOT add exchange rate fetching logic — that is Story 5.1 (the runtime caching config just prepares the service worker for when it exists)
- Do NOT modify `src/data/trip.json`
- Do NOT add TypeScript
- Do NOT install any dependencies beyond `vite-plugin-pwa`

### Performance Budget (from Architecture)

| Metric | Target | Story 1.1 Baseline |
|--------|--------|---------------------|
| JS Bundle (gzipped) | < 80KB | 65.87KB |
| Total page weight | < 500KB (excl. images) | Well under |
| Lighthouse PWA score | 100 | N/A (no PWA yet) |
| First Contentful Paint | < 1.5s | Not measured |
| Largest Contentful Paint | < 2.5s | Not measured |

Adding `vite-plugin-pwa` should not significantly impact bundle size since Workbox code is generated as a separate service worker file, not bundled into the main app JS.

### Service Worker Behavior

- `registerType: 'autoUpdate'` — SW auto-updates in the background, no user prompt needed
- Precaching: All static assets (JS, CSS, HTML, JSON, images, fonts) are cached on first load
- Runtime caching: Exchange rate API responses use StaleWhileRevalidate strategy — serve from cache first, update in background
- Offline: After first visit, the entire app works offline. Users see cached content. The exchange rate will use the last cached value.

### Deployment Notes

- This project uses Vercel connected to a GitHub repo
- Deploy to preview (NOT production) after implementation
- Vercel serves all content over HTTPS by default, which is required for service workers
- Google Fonts are loaded from `fonts.googleapis.com` — these are NOT cached by the service worker precache. On offline loads, if fonts aren't in browser cache, the app will fall back to system fonts. This is acceptable behavior.

### Project Structure Notes

- Alignment with architecture: `public/icons/` matches the architecture's `public/icons/` directory spec
- The architecture specifies `public/splash/` for splash screen images — do NOT create these in this story
- `vite-plugin-pwa` auto-generates the manifest JSON and service worker JS files during build — they go into `dist/`, not source

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#6. PWA Configuration] — Exact VitePWA plugin config with manifest and Workbox settings
- [Source: _bmad-output/planning-artifacts/architecture.md#2. Tech Stack] — vite-plugin-pwa latest
- [Source: _bmad-output/planning-artifacts/architecture.md#8. Performance Budget] — FCP, LCP, bundle size, Lighthouse targets
- [Source: _bmad-output/planning-artifacts/architecture.md#9. Deployment] — Vercel auto-deploy from Git
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3] — Full acceptance criteria
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.4. Onboarding Overlay] — iOS Safari PWA detection (relevant for Story 1.4, but useful context)
- [Source: _bmad-output/planning-artifacts/project-context.md#Dependencies Philosophy] — Minimize dependencies

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
