# Project Brief: CDMX Family Trip Companion

## Project Overview

A mobile-first Progressive Web App (PWA) serving as a personal trip companion for a multi-generational family trip (parents + in-laws) to Mexico City. Designed to be saved to the home screen and function as a lightweight, beautiful, self-contained travel hub — no app store needed.

## Problem Statement

When traveling with older family members who aren't deeply tech-savvy, critical trip info ends up scattered across texts, emails, Google Docs, and screenshots. Parents end up texting "what's the Airbnb address again?" repeatedly. There's no single, delightful place that has everything they need — lodging, itinerary, navigation, translation, currency — in one tap.

## Target Users

- **Primary:** Parents and in-laws (likely 55-70+, varying tech comfort, iPhone/Android mix)
- **Secondary:** The trip organizer (the builder — manages content, curates places)

## Key User Needs

1. Instantly find the Airbnb address and open it in Uber/Maps with one tap
2. Know what's planned for each day without digging through group texts
3. Have a curated phrase book of essential Spanish phrases for common situations
4. Quickly convert prices from pesos to dollars while shopping/dining
5. Discover nearby curated spots with personal recommendations from the trip organizer

## Core Features

### 1. Home Base Card
- Airbnb address, photo, wifi password (tap-to-copy)
- One-tap "Open in Uber" deep link
- One-tap "Open in Maps" link
- Check-in / check-out times

### 2. Interactive Itinerary
- Day-by-day schedule (Thursday to Monday) with pill selector
- Each location is tappable — opens in Google Maps / Apple Maps
- Visual indicators for meal stops, activities, transit
- "Now/Next" indicator highlighting current or upcoming event based on device time
- Organizer notes field per event

### 3. Phrase Book + Translate Link
- Curated phrase book of essential Spanish phrases with categories (restaurant, directions, emergency, polite basics)
- Phonetic pronunciation guide per phrase
- Tap-to-hear pronunciation using Web Speech API
- Outbound link to Google Translate for full translation needs

### 4. Currency Converter
- Simple peso <> USD converter
- Preloaded with live or near-live exchange rate (offline fallback to cached)
- "Quick amounts" buttons for common values ($100, $200, $500, $1000 MXN)
- Display current rate and last-updated timestamp

### 5. Nearby Places
- 70 curated places from the organizer's personal list
- Uses device GPS to sort by proximity (single fetch on tab open)
- Shows: name, distance, category tag, organizer's personal note
- "Navigate" button — opens directions in preferred maps app
- Filter by category (Eat, Drink, See, Shop)

## Technical Preferences

- **Framework:** React (Vite) — single-page app
- **Language:** JavaScript (no TypeScript — keep it light)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (PWA with manifest for home screen install)
- **Data:** JSON-based (no backend needed — all trip data is baked in)
- **APIs:**
  - Exchange rate API (free tier, cached aggressively)
  - Browser Geolocation API for proximity features
  - Web Speech API for phrase pronunciation

## Design Direction

- Warm, vibrant, Mexico-inspired color palette (terracotta, deep teal, warm cream, marigold accents)
- Feels personal and handcrafted, not corporate
- Large tap targets (48px for primary actions) — parents shouldn't need reading glasses
- Card-based layout with clear visual hierarchy
- Delightful micro-interactions (subtle transitions)
- PWA: full-screen when added to home screen, splash screen with trip name

## Success Criteria

- Parents can find the Airbnb address and open Uber in under 5 seconds
- No one texts "where are we going today?" — the app answers it
- At least one parent says "this is so cool" unprompted
- Currency converter gets used at a market within the first day
- App works fully offline for core features during transit

## Scope & Constraints

- Must be buildable in a weekend of vibe-coding
- No user accounts or authentication
- No backend/database — everything is client-side
- Content is manually curated by the organizer (static JSON, redeploy on edit)
- Must work offline for core features (itinerary, home base, phrase book)
- Online for: currency rates, GPS proximity

## Project Name

- "La Familia CDMX"
