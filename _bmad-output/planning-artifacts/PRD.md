# PRD: CDMX Family Trip Companion

## 1. Product Overview

### 1.1 Executive Summary

A mobile-first PWA that serves as a personal, all-in-one travel hub for a multi-generational family trip to Mexico City. The app consolidates lodging info, daily itinerary, phrase book, currency conversion, and curated place recommendations into a single home-screen-installable experience — eliminating the "where are we going?" group text problem.

### 1.2 Vision

The simplest, most delightful way for non-technical family members to have every piece of trip info at their fingertips — no app store download, no login, no friction.

### 1.3 Differentiators

- **Personally curated** — not a generic travel app, but YOUR trip with YOUR notes
- **Zero friction** — PWA install, no accounts, works immediately
- **Proximity-aware** — surfaces nearby recommendations using the organizer's curated places
- **Multi-generational UX** — large targets, clear hierarchy, no buried menus

---

## 2. User Personas

### Persona 1: The Parents / In-Laws (Primary)
- **Age:** 55-70+
- **Tech comfort:** Moderate — uses iPhone/Android daily, comfortable with texts and maps, but won't dig through settings
- **Needs:** Quick answers to "where is the Airbnb?", "what are we doing today?", "how much is that in dollars?"
- **Frustrations:** Info scattered across texts, can't find the address again, feels dependent on the kids for logistics

### Persona 2: The Trip Organizer (Secondary / Builder)
- **Age:** 30s
- **Tech comfort:** High — proficient vibe-coder, curates Google Maps lists, manages logistics
- **Needs:** A single shareable link that answers every question so they're not the group's human search engine
- **Frustrations:** Repeating info, forwarding addresses, managing group chaos

---

## 3. Functional Requirements

### FR-0: Onboarding

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-0.1 | First-time onboarding overlay with iOS Safari "Add to Home Screen" instructions (3 numbered steps with visual cues) | Must |
| FR-0.2 | Only shown on iOS Safari when NOT already in standalone PWA mode | Must |
| FR-0.3 | "Got it, let's go!" dismissal button persists flag to localStorage | Must |
| FR-0.4 | Never shown again after dismissal (localStorage check on load) | Must |

### FR-1: Home Base Card

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Display Airbnb property name, address, and a photo | Must |
| FR-1.2 | "Open in Uber" button using Uber deep link with lat/lng | Must |
| FR-1.3 | "Open in Maps" button detecting iOS (Apple Maps) vs Android (Google Maps) | Must |
| FR-1.4 | Display wifi network name and password with tap-to-copy | Must |
| FR-1.5 | Display check-in / check-out times | Must |

### FR-2: Interactive Itinerary

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Day pill selector for 5 days (Thu-Mon) — tap to switch, no accordions | Must |
| FR-2.2 | Each event shows: time, location name, description/notes, category icon | Must |
| FR-2.3 | Tap any location — open in Google Maps or Apple Maps | Must |
| FR-2.4 | Visual category indicators using emoji (meal, activity, transit, free time) | Must |
| FR-2.5 | "Today" auto-selects on load | Must |
| FR-2.6 | "Now/Next" indicator using device local time — first future event is "Next", preceding event (within 2hr) is "Now" | Should |
| FR-2.7 | Organizer personal notes field per event (e.g., "Mom — you'll love the mole here") | Should |

### FR-3: Phrase Book + Translate Link

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Curated phrase book with categories: Greetings, Restaurant, Directions, Shopping, Emergency | Must |
| FR-3.2 | Each phrase shows: English, Spanish, phonetic pronunciation | Must |
| FR-3.3 | Category tabs to filter phrases | Must |
| FR-3.4 | Tap-to-hear pronunciation via Web Speech API | Should |
| FR-3.5 | Outbound "Open Google Translate" link for full translation needs | Must |

### FR-4: Currency Converter

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Bidirectional USD <> MXN converter with live exchange rate | Must |
| FR-4.2 | Quick-amount buttons for common peso values (100, 200, 500, 1000) | Must |
| FR-4.3 | Display current exchange rate and last-updated timestamp | Must |
| FR-4.4 | Offline fallback to last-fetched cached rate | Must |

### FR-5: Nearby Curated Places (Explore)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Display 70 curated places (name, category, organizer's note, address) | Must |
| FR-5.2 | Request device GPS and sort places by distance (single fetch on tab open) | Must |
| FR-5.3 | Show distance in miles from current location | Must |
| FR-5.4 | "Navigate" button per place — opens in preferred maps app | Must |
| FR-5.5 | Category filter bar: All, Eat, Drink, See, Shop | Must |

---

## 4. Non-Functional Requirements

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-1 | Page load under 3s on 4G connection | Performance |
| NFR-2 | Core features (itinerary, home base, phrase book) work offline via service worker | Reliability |
| NFR-3 | Touch targets minimum 44px; primary action buttons 48px; body text minimum 16px | Accessibility |
| NFR-4 | PWA manifest with app name, icons, theme color, standalone display mode | Installability |
| NFR-5 | Works on Safari iOS 15+, Chrome Android 10+, all modern desktop browsers | Compatibility |
| NFR-6 | No backend required — all data is static JSON or client-fetched APIs | Simplicity |
| NFR-7 | Total bundle size under 500KB (excluding images) | Performance |

---

## 5. Data Architecture

### 5.1 Trip Data (Static JSON)

```json
{
  "trip": {
    "name": "La Familia CDMX",
    "dates": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
    "airbnb": {
      "name": "Property Name",
      "address": "Full Address, CDMX",
      "lat": 19.4326,
      "lng": -99.1332,
      "photo": "/images/airbnb.jpg",
      "wifi": { "network": "SSID", "password": "pass123" },
      "checkIn": "3:00 PM",
      "checkOut": "11:00 AM"
    }
  },
  "itinerary": [
    {
      "date": "YYYY-MM-DD",
      "dayTitle": "Arrival Day",
      "events": [
        {
          "time": "14:00",
          "name": "Check in at Airbnb",
          "category": "transit",
          "lat": 19.4326,
          "lng": -99.1332,
          "notes": "Host will meet us at the door",
          "personalNote": "Mom — the courtyard is gorgeous"
        }
      ]
    }
  ],
  "places": [
    {
      "name": "Contramar",
      "category": "eat",
      "lat": 19.4180,
      "lng": -99.1680,
      "address": "Calle de Durango 200, Roma Nte.",
      "note": "Best tuna tostadas in CDMX. Get there by 1pm."
    }
  ],
  "phrases": [
    {
      "category": "restaurant",
      "english": "Can I have the check, please?",
      "spanish": "¿Me trae la cuenta, por favor?",
      "phonetic": "meh TRA-eh la KWEN-tah, por fah-VOR"
    }
  ]
}
```

### 5.2 External APIs

| API | Purpose | Fallback |
|-----|---------|----------|
| ExchangeRate-API | Live USD/MXN rate | Cached last-known rate in localStorage |
| Browser Geolocation API | User location for proximity | Show all places alphabetically |
| Web Speech API | Phrase pronunciation | Hide speak button if unavailable |

---

## 6. UI/UX Specifications

### 6.1 Navigation

- Bottom tab bar with 5 tabs: Home, Schedule, Phrases, Money, Explore
- Each tab is a single scroll view — no nested navigation
- Active tab highlighted with accent color

### 6.2 Design System

- **Palette:** Terracotta (#C2572B), Deep Teal (#1A535C), Warm Cream (#FFF5E6), Marigold (#E8A838), Charcoal (#2D2D2D)
- **Typography:** Display font (warm serif — e.g., Playfair Display), Body font (clean sans — e.g., DM Sans)
- **Cards:** Rounded corners (16px), subtle shadows, generous padding
- **Iconography:** Emoji-first for category markers — universal, no icon library needed

### 6.3 Key Interactions

- Tap day pills to switch schedule days
- Tap-to-copy on wifi password (with visual confirmation toast)
- Tap-to-hear on phrase book entries
- Now/Next badge on current schedule event
- Category filter taps on Explore tab
- Smooth transitions between tab content

---

## 7. Epics & Stories Overview

### Epic 1: Project Setup & PWA Shell
- E1-S1: Initialize Vite + React + Tailwind project with PWA plugin
- E1-S2: Create app shell with bottom tab navigation
- E1-S3: Configure PWA manifest (name, icons, theme, splash)
- E1-S4: Set up trip data JSON structure and seed data
- E1-S5: iOS Safari onboarding overlay with "Add to Home Screen" instructions (shown once, dismissible, localStorage flag)

### Epic 2: Home Base
- E2-S1: Build AirbnbCard with photo, address, wifi, check-in/out
- E2-S2: Implement "Open in Uber" deep link with lat/lng
- E2-S3: Implement "Open in Maps" with iOS/Android detection
- E2-S4: Add tap-to-copy wifi password with toast confirmation

### Epic 3: Interactive Itinerary
- E3-S1: Build DaySelector pill bar for 5 days
- E3-S2: Build EventCard with time, name, category emoji, notes
- E3-S3: Implement tap-to-navigate on event locations
- E3-S4: Add "Today" auto-detection and "Now/Next" indicator
- E3-S5: Add personal notes display per event

### Epic 4: Phrase Book
- E4-S1: Build PhraseBook component with category tabs
- E4-S2: Build PhraseCard with English, Spanish, phonetic display
- E4-S3: Implement tap-to-hear with Web Speech API
- E4-S4: Add outbound Google Translate link

### Epic 5: Currency Converter
- E5-S1: Build converter UI with input, swap button, result
- E5-S2: Fetch live exchange rate with caching and offline fallback
- E5-S3: Add quick-amount buttons

### Epic 6: Nearby Places (Explore)
- E6-S1: Build PlaceCard with name, note, category, distance
- E6-S2: Implement geolocation and distance calculation (haversine)
- E6-S3: Add category filter bar (All, Eat, Drink, See, Shop)
- E6-S4: Implement "Navigate" deep link per place

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Parents don't add to home screen | Medium | Low | Send direct link + include "Add to Home Screen" instructions banner |
| GPS permission denied | Low | Medium | Graceful fallback: show all places sorted alphabetically |
| Exchange rate API free tier limits | Low | Low | Cache aggressively; show last-known rate with timestamp |
| Uber deep link doesn't work on all devices | Medium | Low | Fallback to Google Maps directions link |
| Web Speech API unavailable on some devices | Medium | Low | Hide speak button; phonetic text always available |

---

## 9. Out of Scope (v1)

- Google Translate widget integration (outbound link only)
- User accounts / authentication
- Backend / database
- Photo sharing wall
- Group voting / polls
- Push notifications
- Multi-trip support
- Offline maps
- Tipping guide
- Host contact info
- Proximity-based notifications ("You're near!")
- Auto-refreshing distance
- Friend's curated places (organizer's list only)
