---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - "_bmad-output/planning-artifacts/PRD.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design.md"
---

# cdmx-companion - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for cdmx-companion, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-0.1: First-time onboarding overlay with iOS Safari "Add to Home Screen" instructions (3 numbered steps with visual cues) [Must]
FR-0.2: Only shown on iOS Safari when NOT already in standalone PWA mode [Must]
FR-0.3: "Got it, let's go!" dismissal button persists flag to localStorage [Must]
FR-0.4: Never shown again after dismissal (localStorage check on load) [Must]
FR-1.1: Display Airbnb property name, address, and a photo [Must]
FR-1.2: "Open in Uber" button using Uber deep link with lat/lng [Must]
FR-1.3: "Open in Maps" button detecting iOS (Apple Maps) vs Android (Google Maps) [Must]
FR-1.4: Display wifi network name and password with tap-to-copy [Must]
FR-1.5: Display check-in / check-out times [Must]
FR-2.1: Day pill selector for 5 days (Thu-Mon) — tap to switch, no accordions [Must]
FR-2.2: Each event shows: time, location name, description/notes, category icon [Must]
FR-2.3: Tap any location — open in Google Maps or Apple Maps [Must]
FR-2.4: Visual category indicators using emoji (meal, activity, transit, free time) [Must]
FR-2.5: "Today" auto-selects on load [Must]
FR-2.6: "Now/Next" indicator using device local time — first future event is "Next", preceding event (within 2hr) is "Now" [Should]
FR-2.7: Organizer personal notes field per event [Should]
FR-3.1: Curated phrase book with categories: Greetings, Restaurant, Directions, Shopping, Emergency [Must]
FR-3.2: Each phrase shows: English, Spanish, phonetic pronunciation [Must]
FR-3.3: Category tabs to filter phrases [Must]
FR-3.4: Tap-to-hear pronunciation via Web Speech API [Should]
FR-3.5: Outbound "Open Google Translate" link for full translation needs [Must]
FR-4.1: Bidirectional USD <> MXN converter with live exchange rate [Must]
FR-4.2: Quick-amount buttons for common peso values (100, 200, 500, 1000) [Must]
FR-4.3: Display current exchange rate and last-updated timestamp [Must]
FR-4.4: Offline fallback to last-fetched cached rate [Must]
FR-5.1: Display 70 curated places (name, category, organizer's note, address) [Must]
FR-5.2: Request device GPS and sort places by distance (single fetch on tab open) [Must]
FR-5.3: Show distance in miles from current location [Must]
FR-5.4: "Navigate" button per place — opens in preferred maps app [Must]
FR-5.5: Category filter bar: All, Eat, Drink, See, Shop [Must]

### NonFunctional Requirements

NFR-1: Page load under 3s on 4G connection [Performance]
NFR-2: Core features (itinerary, home base, phrase book) work offline via service worker [Reliability]
NFR-3: Touch targets minimum 44px; primary action buttons 48px; body text minimum 16px [Accessibility]
NFR-4: PWA manifest with app name, icons, theme color, standalone display mode [Installability]
NFR-5: Works on Safari iOS 15+, Chrome Android 10+, all modern desktop browsers [Compatibility]
NFR-6: No backend required — all data is static JSON or client-fetched APIs [Simplicity]
NFR-7: Total bundle size under 500KB (excluding images) [Performance]

### Additional Requirements

- Starter Template: Vite + React (JSX, not TypeScript) + Tailwind CSS + vite-plugin-pwa
- Static trip data in src/data/trip.json imported at build time — zero runtime fetching for core content
- Exchange rate cached in localStorage with 4-hour refresh interval
- Geolocation requested only on Explore tab load (not app init) to avoid premature permission prompt
- Deep link implementations for Uber (with web fallback), Apple Maps, Google Maps with platform detection
- Service worker with Workbox — cache app shell, JSON, and exchange rate (StaleWhileRevalidate)
- Performance budget: FCP < 1.5s, LCP < 2.5s, JS bundle < 80KB gzipped, Lighthouse PWA score 100
- Vercel hosting with auto-deploy from Git

### UX Design Requirements

UX-DR1: Implement 7-token color palette — Terracotta (#C2572B), Deep Teal (#1A535C), Warm Cream (#FFF5E6), Marigold (#E8A838), Charcoal (#2D2D2D), Light Teal (#4ECDC4), Warm Gray (#F0EBE3) with specified usage roles
UX-DR2: Typography system with Playfair Display (display/headers) and DM Sans (body), minimum 16px body text
UX-DR3: Card system with 16px rounded corners, subtle shadow (0 2px 12px rgba(0,0,0,0.08)), warm-gray backgrounds on cream page
UX-DR4: Bottom tab bar (5 tabs) always visible, terracotta underline accent on active tab, labels below icons
UX-DR5: Home tab hero photo full-width bleed, trip countdown with marigold accent ("5 days away!" / "Day 2 of 5!"), side-by-side Uber+Maps buttons (48px, teal bg)
UX-DR6: Schedule tab day pills with plane emoji on bookend days, teal fill active/outline inactive, 3px left border accent colored by category on event cards
UX-DR7: NOW badge (marigold bg, bold white text) and NEXT badge (light-teal outline) treatment on schedule events
UX-DR8: Personal notes displayed in italic, muted color — whispered aside treatment with speech bubble styling
UX-DR9: Explore tab with distance right-aligned in muted terracotta, organizer notes in quotes with warm-gray background, graceful GPS-denied state
UX-DR10: Onboarding overlay with Mexico flag, warm/friendly tone, "Got it, let's go!" CTA (48px, teal), "Don't show this again" checkbox
UX-DR11: Toast notification system — "Copied!" toast bottom-center, auto-dismiss 2s, warm-gray bg, rounded corners
UX-DR12: Shared interaction patterns — subtle card tap scale (0.98), fade transitions between tabs (CSS only), consistent Navigate button placement (terracotta, right-aligned, 44px)

### FR Coverage Map

FR-0.1: Epic 1 — iOS Safari onboarding overlay
FR-0.2: Epic 1 — Conditional display (iOS Safari, not standalone)
FR-0.3: Epic 1 — Dismissal persists to localStorage
FR-0.4: Epic 1 — Never shown after dismissal
FR-1.1: Epic 2 — Airbnb name, address, photo
FR-1.2: Epic 2 — Open in Uber deep link
FR-1.3: Epic 2 — Open in Maps (platform detection)
FR-1.4: Epic 2 — Wifi tap-to-copy
FR-1.5: Epic 2 — Check-in/check-out times
FR-2.1: Epic 3 — Day pill selector
FR-2.2: Epic 3 — Event card display
FR-2.3: Epic 3 — Tap-to-navigate events
FR-2.4: Epic 3 — Category emoji indicators
FR-2.5: Epic 3 — Today auto-select
FR-2.6: Epic 3 — Now/Next indicator
FR-2.7: Epic 3 — Personal notes per event
FR-3.1: Epic 4 — Phrase book with categories
FR-3.2: Epic 4 — English/Spanish/phonetic display
FR-3.3: Epic 4 — Category tabs
FR-3.4: Epic 4 — Tap-to-hear (Web Speech API)
FR-3.5: Epic 4 — Google Translate outbound link
FR-4.1: Epic 5 — Bidirectional USD/MXN converter
FR-4.2: Epic 5 — Quick-amount buttons
FR-4.3: Epic 5 — Rate display with timestamp
FR-4.4: Epic 5 — Offline fallback to cached rate
FR-5.1: Epic 6 — 70 curated places display
FR-5.2: Epic 6 — GPS sort by distance
FR-5.3: Epic 6 — Distance in miles
FR-5.4: Epic 6 — Navigate button per place
FR-5.5: Epic 6 — Category filter bar

## Epic List

### Epic 1: App Foundation & Onboarding
Family members can install the PWA on their home screen, open it, and navigate between tabs with the full design system in place.
**FRs covered:** FR-0.1, FR-0.2, FR-0.3, FR-0.4
**NFRs addressed:** NFR-2, NFR-3, NFR-4, NFR-5, NFR-6, NFR-7
**UX-DRs addressed:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR10, UX-DR11, UX-DR12

### Epic 2: Home Base
Family members can instantly see where they're staying, get directions via Uber or Maps, and copy the wifi password — answering "where's the Airbnb?" once and for all.
**FRs covered:** FR-1.1, FR-1.2, FR-1.3, FR-1.4, FR-1.5
**UX-DRs addressed:** UX-DR5

### Epic 3: Interactive Itinerary
Family members can check the daily schedule, see what's happening now/next, read the organizer's personal notes, and navigate to any event location.
**FRs covered:** FR-2.1, FR-2.2, FR-2.3, FR-2.4, FR-2.5, FR-2.6, FR-2.7
**UX-DRs addressed:** UX-DR6, UX-DR7, UX-DR8

### Epic 4: Phrase Book
Family members can look up common Spanish phrases by category, see phonetic pronunciation, hear them spoken aloud, and jump to Google Translate for anything else.
**FRs covered:** FR-3.1, FR-3.2, FR-3.3, FR-3.4, FR-3.5

### Epic 5: Currency Converter
Family members can instantly convert between USD and MXN with a live rate, tap common amounts, and still use it offline.
**FRs covered:** FR-4.1, FR-4.2, FR-4.3, FR-4.4

### Epic 6: Nearby Places (Explore)
Family members can browse 70 curated places sorted by proximity, filter by category, and navigate to any spot — like having the organizer's local knowledge in their pocket.
**FRs covered:** FR-5.1, FR-5.2, FR-5.3, FR-5.4, FR-5.5
**UX-DRs addressed:** UX-DR9

## Epic 1: App Foundation & Onboarding

Family members can install the PWA on their home screen, open it, and navigate between tabs with the full design system in place.

### Story 1.1: Project Scaffold & Design System

As a **trip organizer**,
I want a solid project foundation with the design system in place,
So that all future features look and feel consistent from day one.

**Acceptance Criteria:**

**Given** a fresh project
**When** `npm run dev` is executed
**Then** a Vite + React + Tailwind app starts with no errors
**And** Tailwind config includes all 7 design tokens: Terracotta (#C2572B), Deep Teal (#1A535C), Warm Cream (#FFF5E6), Marigold (#E8A838), Charcoal (#2D2D2D), Light Teal (#4ECDC4), Warm Gray (#F0EBE3)
**And** Playfair Display (display) and DM Sans (body) fonts are loaded
**And** base card styles use 16px rounded corners, shadow `0 2px 12px rgba(0,0,0,0.08)`, warm-gray bg
**And** body text is minimum 16px, touch targets minimum 44px
**And** `src/data/trip.json` contains seed data matching the PRD schema (airbnb, itinerary, places, phrases)
**And** page background is Warm Cream (#FFF5E6)

### Story 1.2: Bottom Tab Navigation

As a **family member**,
I want a clear tab bar at the bottom of the screen,
So that I can quickly jump to any section without getting lost.

**Acceptance Criteria:**

**Given** the app is open
**When** the page loads
**Then** a bottom tab bar displays 5 tabs: Home, Schedule, Phrases, Money, Explore
**And** each tab has a label below its icon
**And** the active tab shows a terracotta underline accent
**And** tapping a tab switches content with a CSS fade transition
**And** the tab bar is always visible (never hides on scroll)
**And** the Home tab is active by default on load
**And** tab bar buttons meet 44px minimum tap target

### Story 1.3: PWA Configuration & Deployment

As a **family member**,
I want to install the app on my home screen and have it work offline,
So that I can access trip info anytime, even without internet.

**Acceptance Criteria:**

**Given** the app is deployed to Vercel
**When** a user opens the URL
**Then** the PWA manifest includes name "La Familia CDMX", theme_color #1A535C, background_color #FFF5E6, display "standalone"
**And** PWA icons (192px and 512px) are present
**And** the service worker caches the app shell, JSON data, and static assets via Workbox
**And** the app works offline for core features (displays cached content)
**And** total bundle size is under 500KB (excluding images)
**And** the app loads under 3s on a 4G connection

### Story 1.4: iOS Safari Onboarding Overlay

As a **family member on an iPhone**,
I want clear instructions for adding this to my home screen,
So that I can install it without asking for help.

**Acceptance Criteria:**

**Given** the user is on iOS Safari and NOT in standalone PWA mode and has NOT previously dismissed the overlay
**When** the app loads
**Then** a full-screen overlay appears on cream background with: Mexico flag, "La Familia CDMX" title, friendly intro text, and 3 numbered steps (tap Share, tap "Add to Home Screen", tap "Add")
**And** a "Got it, let's go!" button (48px tall, teal bg) dismisses the overlay

**Given** the user taps "Got it, let's go!"
**When** the overlay is dismissed
**Then** `localStorage.setItem('onboarding_dismissed', 'true')` is set
**And** the user sees the Home tab

**Given** the user has previously dismissed the overlay (localStorage flag exists)
**When** the app loads
**Then** the overlay is NOT shown

**Given** the user is on Android, desktop, or already in standalone PWA mode
**When** the app loads
**Then** the overlay is NOT shown

### Story 1.5: Toast System & Shared Interactions

As a **family member**,
I want consistent visual feedback when I interact with the app,
So that I know my taps are registering and actions succeeded.

**Acceptance Criteria:**

**Given** a toast-triggering action occurs (e.g., copy to clipboard)
**When** the toast fires
**Then** a notification appears bottom-center with warm-gray bg, charcoal text, rounded corners
**And** the toast auto-dismisses after 2 seconds

**Given** a card is tapped
**When** the tap begins
**Then** the card subtly scales to 0.98 (transform: scale(0.98))
**And** returns to 1.0 on release

**Given** a Navigate button appears on any card
**When** rendered
**Then** it is right-aligned, terracotta text, 44px tap target, consistent across all tabs

## Epic 2: Home Base

Family members can instantly see where they're staying, get directions via Uber or Maps, and copy the wifi password — answering "where's the Airbnb?" once and for all.

### Story 2.1: Airbnb Card with Photo & Details

As a **family member**,
I want to see the Airbnb info — photo, name, address, and check-in times — all in one place,
So that I don't have to dig through texts to find where we're staying.

**Acceptance Criteria:**

**Given** the user taps the Home tab
**When** the Home tab renders
**Then** a full-width hero photo of the Airbnb displays at the top, bleeding to edges
**And** the trip name "La Familia CDMX" is displayed with a countdown ("5 days away!" pre-trip, or "Day 2 of 5!" during trip) in marigold accent
**And** the property address is displayed below
**And** check-in time (3:00 PM) and check-out time (11:00 AM) are displayed in a card
**And** all text uses the design system fonts and colors

### Story 2.2: Uber & Maps Navigation Buttons

As a **family member**,
I want one-tap directions to the Airbnb via Uber or Maps,
So that I can get back without copying addresses or asking for help.

**Acceptance Criteria:**

**Given** the Home tab is displayed
**When** the user views the Airbnb card
**Then** two side-by-side buttons appear: "Open in Uber" and "Open in Maps" (48px tall, teal bg, white text)

**Given** the user taps "Open in Uber"
**When** Uber app is installed
**Then** Uber opens with pickup at current location and dropoff at the Airbnb lat/lng
**When** Uber app is NOT installed
**Then** the mobile Uber web URL opens as fallback

**Given** the user taps "Open in Maps"
**When** the user is on iOS
**Then** Apple Maps opens with directions to the Airbnb lat/lng
**When** the user is on Android or desktop
**Then** Google Maps opens with directions to the Airbnb lat/lng

### Story 2.3: Wifi Card with Tap-to-Copy

As a **family member**,
I want to see the wifi password and copy it with one tap,
So that I can connect without typing a long password or asking again.

**Acceptance Criteria:**

**Given** the Home tab is displayed
**When** the user views the wifi card
**Then** the wifi network name is displayed
**And** the password is displayed with a visible "Copy" button

**Given** the user taps the "Copy" button
**When** the clipboard write succeeds
**Then** the password is copied to the device clipboard
**And** a "Copied!" toast appears bottom-center and auto-dismisses after 2 seconds

## Epic 3: Interactive Itinerary

Family members can check the daily schedule, see what's happening now/next, read the organizer's personal notes, and navigate to any event location.

### Story 3.1: Day Selector & Event Cards

As a **family member**,
I want to pick a day and see all events for that day,
So that I know exactly what's planned without scrolling through everything.

**Acceptance Criteria:**

**Given** the user taps the Schedule tab
**When** the tab renders
**Then** 5 day pills are displayed horizontally (Thu–Mon)
**And** arrival (Thu) and departure (Mon) pills show a plane emoji
**And** the active pill has teal fill with white text; inactive pills are outline only
**And** tapping a pill switches the displayed events (no slide animation, content swap)

**Given** each event for the selected day
**When** displayed
**Then** the event card shows: time, location name, description/notes, and category emoji
**And** each card has a 3px left border accent colored by category
**And** a day title (e.g., "Thursday — Arrival Day") appears above the event list

### Story 3.2: Today Auto-Select & Now/Next Indicators

As a **family member**,
I want the app to show me today's schedule and highlight what's happening now,
So that I can glance at my phone and immediately know where to be.

**Acceptance Criteria:**

**Given** the current date matches one of the 5 trip days
**When** the Schedule tab loads
**Then** today's day pill is auto-selected

**Given** the current date does NOT match a trip day
**When** the Schedule tab loads
**Then** the first day (Thursday) is selected by default

**Given** today is selected and there are events with future times
**When** the events render
**Then** the first event whose time hasn't passed gets a "NEXT" badge (light-teal outline)
**And** the preceding event (if within a 2-hour window) gets a "NOW" badge (marigold bg, bold white text)

**Given** all events for today have passed
**When** the events render
**Then** no NOW/NEXT badges are shown

### Story 3.3: Event Navigation & Personal Notes

As a **family member**,
I want to tap any event to get directions, and see the organizer's personal tips,
So that I can navigate there easily and enjoy the insider recommendations.

**Acceptance Criteria:**

**Given** an event card with a location (lat/lng)
**When** the user taps the "Navigate" button
**Then** the preferred maps app opens (Apple Maps on iOS, Google Maps on Android/desktop) with directions to the event's lat/lng

**Given** an event has a personalNote field
**When** the event card renders
**Then** the personal note is displayed in italic, muted color, with speech bubble styling — like a whispered aside from the organizer

**Given** an event does NOT have a personalNote
**When** the event card renders
**Then** no personal note section is shown (no empty space)

## Epic 4: Phrase Book

Family members can look up common Spanish phrases by category, see phonetic pronunciation, hear them spoken aloud, and jump to Google Translate for anything else.

### Story 4.1: Phrase Book with Category Tabs

As a **family member**,
I want to browse Spanish phrases organized by situation,
So that I can quickly find what to say at a restaurant, when shopping, or in an emergency.

**Acceptance Criteria:**

**Given** the user taps the Phrases tab
**When** the tab renders
**Then** category filter tabs are displayed: Greetings, Restaurant, Directions, Shopping, Emergency
**And** tapping a category filters the phrase list to that category
**And** each phrase card shows: English text, Spanish text, and phonetic pronunciation
**And** cards follow the design system (warm-gray bg, 16px radius, card shadow)
**And** an "Open Google Translate" link is visible at the top or bottom of the tab, opening `translate.google.com` with English→Spanish pre-set

### Story 4.2: Tap-to-Hear Pronunciation

As a **family member**,
I want to tap a phrase and hear it spoken in Spanish,
So that I can practice pronunciation before saying it to someone.

**Acceptance Criteria:**

**Given** the device supports the Web Speech API
**When** a phrase card is displayed
**Then** a tap-to-hear button is visible on the card

**Given** the user taps the hear button
**When** the Speech API fires
**Then** the Spanish text is spoken aloud, using a Spanish voice if available on the device

**Given** the device does NOT support Web Speech API
**When** the phrase card renders
**Then** the tap-to-hear button is hidden (not shown at all)
**And** the phonetic text remains visible as the fallback

## Epic 5: Currency Converter

Family members can instantly convert between USD and MXN with a live rate, tap common amounts, and still use it offline.

### Story 5.1: Bidirectional Converter with Live Rate

As a **family member**,
I want to type an amount in pesos or dollars and instantly see the conversion,
So that I know what things cost without doing mental math.

**Acceptance Criteria:**

**Given** the user taps the Money tab
**When** the tab renders
**Then** a converter UI displays with an input field, a swap button to toggle direction, and the converted result
**And** the current exchange rate is fetched from the ExchangeRate API on load
**And** the rate and a "Last updated: [timestamp]" are displayed
**And** typing a value updates the conversion in real-time

**Given** the user taps the swap button
**When** the direction toggles
**Then** the converter switches between USD→MXN and MXN→USD
**And** any entered value is re-converted in the new direction

**Given** the cached rate is older than 4 hours
**When** the Money tab loads
**Then** a fresh rate is fetched from the API and cached in localStorage

### Story 5.2: Quick-Amount Buttons & Offline Fallback

As a **family member**,
I want to tap common peso amounts for a quick conversion, even without internet,
So that I can check prices on the go — like at a market stall with no signal.

**Acceptance Criteria:**

**Given** the converter is displayed
**When** the user views the quick-amount section
**Then** buttons for 100, 200, 500, and 1000 pesos are visible
**And** tapping a button populates the input with that amount and shows the USD conversion

**Given** the device is offline and a cached rate exists in localStorage
**When** the Money tab loads
**Then** the cached rate is used for conversions
**And** "Last updated: [timestamp]" shows when the rate was last fetched

**Given** the device is offline and NO cached rate exists
**When** the Money tab loads
**Then** the converter still renders but displays a message indicating the rate is unavailable

## Epic 6: Nearby Places (Explore)

Family members can browse 70 curated places sorted by proximity, filter by category, and navigate to any spot — like having the organizer's local knowledge in their pocket.

### Story 6.1: Place Cards with Category Filter

As a **family member**,
I want to browse the organizer's curated places and filter by what I'm in the mood for,
So that I can find a great restaurant, bar, or sight without Googling.

**Acceptance Criteria:**

**Given** the user taps the Explore tab
**When** the tab renders
**Then** 70 curated places are displayed as cards showing: category emoji, name, address, and the organizer's note in quotes with warm-gray background
**And** a category filter bar appears at the top with pills: All, Eat, Drink, See, Shop
**And** "All" is selected by default
**And** tapping a category pill filters the list to that category (teal fill when active, outline when inactive)
**And** cards have generous padding for easy tapping through a long scrollable list

### Story 6.2: Geolocation, Distance Sort & Navigation

As a **family member**,
I want to see which curated places are closest to me and get directions with one tap,
So that I can explore the neighborhood without planning ahead.

**Acceptance Criteria:**

**Given** the Explore tab loads for the first time
**When** the tab renders
**Then** the browser requests GPS permission via `navigator.geolocation.getCurrentPosition` (single fetch, no auto-refresh)

**Given** GPS permission is granted
**When** the user's position is received
**Then** places are sorted by distance (nearest first) using haversine calculation
**And** distance in miles is displayed right-aligned in muted terracotta on each card
**And** a subtitle reads "Sorted by distance from you"

**Given** GPS permission is denied or unavailable
**When** the tab renders
**Then** places are sorted alphabetically
**And** no distance values are shown
**And** the subtitle reads "Sorted alphabetically"

**Given** any place card
**When** the user taps the "Navigate" button
**Then** the preferred maps app opens (Apple Maps on iOS, Google Maps on Android/desktop) with directions to that place's lat/lng
