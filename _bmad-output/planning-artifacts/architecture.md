# Architecture: CDMX Family Trip Companion

## 1. Architecture Overview

This is a **static single-page application** with zero backend dependencies. All trip data lives in a JSON file bundled at build time. The only external API call is for currency exchange rates. The app is deployed as a PWA for home-screen installation.

```
+-----------------------------------------------+
|                  Browser                       |
|  +-------------------------------------------+|
|  |          React SPA (Vite)                 ||
|  |  +---------+ +----------+ +--------+     ||
|  |  |  Tabs   | | Trip Data| | State  |     ||
|  |  |  Router | |  (JSON)  | |(React) |     ||
|  |  +---------+ +----------+ +--------+     ||
|  +-------------------------------------------+|
|  +-------------------------------------------+|
|  |          Service Worker (PWA)             ||
|  |  Cache: app shell, JSON, last FX rate     ||
|  +-------------------------------------------+|
+---------------+-------------------------------+
                |
       +--------+------+
       | Exchange      |
       | Rate API      |
       | (fetch)       |
       +---------------+
```

## 2. Tech Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React | 18+ | Component model, hooks, large ecosystem |
| Build Tool | Vite | 5+ | Fast HMR, native ESM, excellent PWA plugin |
| Styling | Tailwind CSS | 3+ | Utility-first, responsive, small bundle |
| PWA | vite-plugin-pwa | latest | Workbox under the hood, auto-generates SW |
| Hosting | Vercel | — | Free, instant deploys from Git, global CDN |
| Language | JavaScript (JSX) | ES2022 | No TypeScript overhead for a weekend project |

## 3. Project Structure

```
cdmx-trip-app/
+-- docs/                    # BMAD artifacts
|   +-- project-brief.md
|   +-- PRD.md
|   +-- architecture.md
+-- public/
|   +-- icons/               # PWA icons (192, 512)
|   +-- splash/              # Splash screen images
|   +-- images/              # Airbnb photo, etc.
+-- src/
|   +-- main.jsx             # Entry point
|   +-- App.jsx              # Tab router + layout
|   +-- data/
|   |   +-- trip.json        # All trip data
|   +-- components/
|   |   +-- TabBar.jsx
|   |   +-- home/
|   |   |   +-- HomeTab.jsx
|   |   |   +-- AirbnbCard.jsx
|   |   |   +-- TripCountdown.jsx
|   |   +-- schedule/
|   |   |   +-- ScheduleTab.jsx
|   |   |   +-- DaySelector.jsx
|   |   |   +-- EventCard.jsx
|   |   |   +-- NowNextIndicator.jsx
|   |   +-- phrases/
|   |   |   +-- PhrasesTab.jsx
|   |   |   +-- PhraseBook.jsx
|   |   |   +-- PhraseCard.jsx
|   |   +-- currency/
|   |   |   +-- CurrencyTab.jsx
|   |   |   +-- Converter.jsx
|   |   +-- explore/
|   |       +-- ExploreTab.jsx
|   |       +-- PlaceCard.jsx
|   |       +-- CategoryFilter.jsx
|   +-- hooks/
|   |   +-- useGeolocation.js
|   |   +-- useExchangeRate.js
|   |   +-- useCurrentDay.js
|   |   +-- useNowNext.js
|   +-- utils/
|       +-- distance.js      # Haversine formula
|       +-- deeplinks.js     # Uber, Maps URL builders
|       +-- clipboard.js     # Copy-to-clipboard helper
|       +-- speech.js        # Web Speech API helper
+-- index.html
+-- tailwind.config.js
+-- vite.config.js
+-- package.json
```

## 4. Data Flow

### 4.1 Static Trip Data
- All trip content (itinerary, places, phrases, Airbnb info) is stored in `src/data/trip.json`
- Imported at build time — zero runtime fetching for core content
- Organizer updates data by editing the JSON and redeploying (Vercel auto-deploys on push)
- 70 curated places with 4 categories (eat, drink, see, shop)

### 4.2 Exchange Rate
- Fetched on app load from free API (e.g., `https://open.er-api.com/v6/latest/USD`)
- Cached in localStorage with timestamp
- If offline or API fails, falls back to cached rate
- Re-fetches if cached rate is older than 4 hours

### 4.3 Geolocation
- Requested on Explore tab load (not on app init — avoid premature permission prompt)
- Single fetch via `navigator.geolocation.getCurrentPosition`
- Distance calculated client-side via haversine formula
- Graceful degradation: if denied, shows places sorted alphabetically with no distance

### 4.4 Now/Next Indicator
- Uses device local time via `new Date()` — no timezone library needed
- Compares current time against itinerary events for the current day
- First event whose time hasn't passed = "Next", the one before it (if within 2hr window) = "Now"
- Updates on schedule tab load, no live polling

### 4.5 Text-to-Speech
- Uses Web Speech API (`speechSynthesis.speak()`) for phrase pronunciation
- Attempts to use a Spanish voice if available on the device
- Graceful degradation: if unavailable, the tap-to-hear button simply doesn't appear

## 5. Deep Link Specifications

### 5.1 Uber
```
uber://?action=setPickup&pickup=my_location&dropoff[latitude]={lat}&dropoff[longitude]={lng}&dropoff[nickname]={name}
```
Fallback (no app installed):
```
https://m.uber.com/ul/?action=setPickup&dropoff[latitude]={lat}&dropoff[longitude]={lng}&dropoff[nickname]={name}
```

### 5.2 Apple Maps (iOS)
```
https://maps.apple.com/?daddr={lat},{lng}&dirflg=d
```

### 5.3 Google Maps (Android / Web)
```
https://www.google.com/maps/dir/?api=1&destination={lat},{lng}
```

### 5.4 Platform Detection
```js
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const mapsUrl = isIOS
  ? `https://maps.apple.com/?daddr=${lat},${lng}`
  : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
```

### 5.5 Google Translate (outbound)
```
https://translate.google.com/?sl=en&tl=es
```

## 6. PWA Configuration

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
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
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/open\.er-api\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'exchange-rate', expiration: { maxAgeSeconds: 14400 } }
          }
        ]
      }
    })
  ]
}
```

## 7. Key Utilities

### 7.1 Haversine Distance
```js
export function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### 7.2 Clipboard with Feedback
```js
export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
  return true;
}
```

## 8. Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| JS Bundle (gzipped) | < 80KB |
| Total page weight | < 500KB (excl. images) |
| Lighthouse PWA score | 100 |

## 9. Deployment

1. Push to GitHub repo
2. Connect repo to Vercel
3. Auto-deploys on every push to `main`
4. Share the URL with family — they open it and tap "Add to Home Screen"

## 10. Security Considerations

- No sensitive data (no auth tokens, no PII beyond Airbnb wifi password)
- All external API calls are to public endpoints (no API keys exposed)
- Exchange rate API uses free tier with no key
- HTTPS enforced by Vercel by default
