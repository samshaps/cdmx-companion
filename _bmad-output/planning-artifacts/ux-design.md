# UX Design: CDMX Family Trip Companion

## 1. Design Philosophy

- **Personal and handcrafted** — feels like a love letter from the trip organizer, not a generic travel app
- **Multi-generational UX** — designed for parents/in-laws (55-70+) who are comfortable with phones but won't dig through settings
- **One question per tab** — each tab answers exactly one thing: Where am I staying? What's the plan? How do I say this? How much is that? What's nearby?

## 2. Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Terracotta | #C2572B | Active tab accent, navigate buttons, CTA secondary |
| Deep Teal | #1A535C | Primary buttons (Uber, Maps), active pill fills, header accents |
| Warm Cream | #FFF5E6 | Page background |
| Marigold | #E8A838 | NOW badge, countdown accent, highlights |
| Charcoal | #2D2D2D | Body text |
| Light Teal | #4ECDC4 | NEXT badge outline, secondary accents |
| Warm Gray | #F0EBE3 | Card backgrounds |

### Typography

- **Display font:** Warm serif (e.g., Playfair Display) — for headers, trip name, tab titles
- **Body font:** Clean sans-serif (e.g., DM Sans) — for all content text
- **Minimum body text:** 16px
- **Minimum tap target:** 44px (48px for primary action buttons)

### Cards

- Rounded corners: 16px (`--radius-card`)
- Subtle shadow: `0 2px 12px rgba(0,0,0,0.08)` (`--shadow-card`)
- Generous internal padding
- Warm gray background (#F0EBE3) on cream page background

### Iconography

- Emoji-first for category markers — universal across platforms, no icon library needed
- Category markers: meal (plates), activity (varies), transit (car/plane), free time (sun)
- Tab bar: Home, Schedule, Phrases, Money, Explore
- Navigate buttons use compass emoji

## 3. Navigation

### Bottom Tab Bar

- 5 tabs, always visible, never hides on scroll
- Active tab gets terracotta underline/accent
- Tab labels below icons

```
  Home      Schedule   Phrases    Money     Explore
```

- Each tab is a single scroll view — no nested navigation, no drill-down screens

## 4. Screen Designs

### 4.1 Home Tab

```
+------------------------------------------+
| [AIRBNB PHOTO - full-width hero image]   |
|                                          |
|------------------------------------------|
|                                          |
|  La Familia CDMX           5 days away!  |
|  --------------------------------------- |
|  Pin  Calle Orizaba 142, Roma Norte,     |
|       Cuauhtemoc, 06700 CDMX             |
|                                          |
|  +------------------+ +----------------+ |
|  |   Car Open in    | | Map Open in    | |
|  |      Uber        | |     Maps       | |
|  +------------------+ +----------------+ |
|       [teal bg, white text, 48px h]      |
|                                          |
|  +--------------------------------------+|
|  |  Wifi                                ||
|  |  Network: CasaRoma_Guest             ||
|  |  Password: ********   [ Copy ]       ||
|  +--------------------------------------+|
|                                          |
|  +--------------------------------------+|
|  |  Clock Check-in: 3:00 PM             ||
|  |  Clock Check-out: 11:00 AM           ||
|  +--------------------------------------+|
|                                          |
|------------------------------------------|
|  Home    Schedule  Phrases  Money  Explore|
+------------------------------------------+
```

**Behavior:**
- Hero photo bleeds to edges, overlaps behind status bar for immersion
- "5 days away!" countdown uses marigold accent — swaps to "Day 2 of 5!" during the trip
- Uber and Maps buttons are side-by-side, equal weight, 48px tall, teal background
- Wifi card has a visible Copy button — tapping shows a brief "Copied!" toast (2s)
- Cream background, cards have warm-gray bg

### 4.2 Schedule Tab

```
+------------------------------------------+
|                                          |
|  Schedule                                |
|                                          |
|  +------++-----++-----++-----++------+   |
|  |Thu   || Fri || Sat || Sun ||Mon   |   |
|  |plane ||     ||     ||     ||plane |   |
|  +------++-----++-----++-----++------+   |
|   [active = teal fill + white text]      |
|   [inactive = outline only]              |
|                                          |
|  Thursday - Arrival Day                  |
|  ======================================= |
|                                          |
|  +--------------------------------------+|
|  |  > NOW                               ||
|  |  Car 2:00 PM - Arrive at Airport     ||
|  |  "Uber from MEX to Roma Norte"       ||
|  |                        [ Navigate ]  ||
|  +--------------------------------------+|
|       [NOW badge: marigold bg, bold]     |
|                                          |
|  +--------------------------------------+|
|  |  > NEXT                              ||
|  |  House 3:00 PM - Check in at Airbnb  ||
|  |  "Host meets us at the door"         ||
|  |  Speech "Mom - the courtyard is      ||
|  |          gorgeous"                    ||
|  |                        [ Navigate ]  ||
|  +--------------------------------------+|
|       [NEXT badge: light-teal outline]   |
|                                          |
|  +--------------------------------------+|
|  |  Plates 7:00 PM - Dinner at          ||
|  |                    Contramar          ||
|  |  "Roma Norte - Best tuna tostadas"   ||
|  |  Speech "Get there early, fills up!" ||
|  |                        [ Navigate ]  ||
|  +--------------------------------------+|
|                                          |
|------------------------------------------|
|  Home    Schedule  Phrases  Money  Explore|
+------------------------------------------+
```

**Behavior:**
- 5 day pills horizontally laid out — arrival/departure days get plane emoji on bookends
- Active day = solid teal fill + white text; inactive = outline
- "Today" auto-selects on load
- NOW badge: marigold background, bold white text — eye-catching but not alarming
- NEXT badge: light-teal outline — visually secondary to NOW
- Now/Next logic: compare device local time via `new Date()` against event times. First future event = NEXT, preceding event within 2hr window = NOW
- Personal notes (speech bubble) in italic, slightly muted color — like a whispered aside
- Navigate button: right-aligned, terracotta text, 44px tap target
- Cards have 3px left border accent colored by category
- Category emoji on each card for visual scanning

### 4.3 Explore Tab

```
+------------------------------------------+
|                                          |
|  Explore                                 |
|  Pin Sorted by distance from you         |
|                                          |
|  +-----++------++-------++-----++------+ |
|  | All ||Plates||Cup    || Eye ||Bag   | |
|  |     || Eat  ||Drink  || See ||Shop  | |
|  +-----++------++-------++-----++------+ |
|  [active = teal fill]                    |
|                                          |
|  +--------------------------------------+|
|  |  Plates  Contramar            0.3 mi ||
|  |  Calle de Durango 200, Roma Nte.     ||
|  |  "Best tuna tostadas in CDMX.       ||
|  |   Get there by 1pm."                ||
|  |                        [ Navigate ]  ||
|  +--------------------------------------+|
|                                          |
|  +--------------------------------------+|
|  |  Cup  Baltra Bar              0.4 mi ||
|  |  Iztaccihuatl 36D, Roma Sur          ||
|  |  "Incredible mezcal cocktails.       ||
|  |   Try the smoked pineapple."         ||
|  |                        [ Navigate ]  ||
|  +--------------------------------------+|
|                                          |
|  +--------------------------------------+|
|  |  Eye  Palacio de Bellas Artes 0.8 mi ||
|  |  Av. Juarez, Centro Historico        ||
|  |  "Go inside for the murals.          ||
|  |   Free on Sundays."                  ||
|  |                        [ Navigate ]  ||
|  +--------------------------------------+|
|                                          |
|              ... scrollable ...          |
|                                          |
|------------------------------------------|
|  Home    Schedule  Phrases  Money  Explore|
+------------------------------------------+
```

**Behavior:**
- Category filter pills: horizontal, same visual treatment as day pills (teal fill when active)
- Default: "All" selected, sorted by distance
- Distance: right-aligned in muted terracotta — scannable at a glance
- Organizer notes in quotes with warm-gray background — feels personal, like a handwritten note
- If GPS denied: "Sorted by distance" line changes to "Sorted alphabetically", distance values hidden
- Navigate button: consistent with Schedule tab — same position, same style
- Category emoji on each card reinforces the filter
- Generous card padding — easy to tap the right card even with 70 items scrolling
- Single GPS fetch on tab open, no auto-refresh

### 4.4 Onboarding Overlay (iOS Safari Only)

```
+------------------------------------------+
|                                          |
|                                          |
|            Mexico flag                   |
|                                          |
|        La Familia CDMX                   |
|                                          |
|   Your family trip companion app.        |
|   Add it to your home screen to          |
|   use it like a real app!                |
|                                          |
|  +--------------------------------------+|
|  |                                      ||
|  |  1. Tap the Share button  [up arrow] ||
|  |     at the bottom of Safari          ||
|  |                                      ||
|  |  2. Scroll down and tap              ||
|  |     "Add to Home Screen" [plus]      ||
|  |                                      ||
|  |  3. Tap "Add" in the top right       ||
|  |                                      ||
|  |  That's it! Open it from your        ||
|  |  home screen anytime.                ||
|  |                                      ||
|  +--------------------------------------+|
|                                          |
|  +--------------------------------------+|
|  |         Got it, let's go!  ->        ||
|  +--------------------------------------+|
|        [48px tall, teal bg, bold]        |
|                                          |
|    ( ) Don't show this again             |
|                                          |
+------------------------------------------+
```

**Behavior:**
- Only shown when: iOS + Safari + NOT standalone mode + no localStorage dismissal flag
- Detection: `window.matchMedia('(display-mode: standalone)').matches` and UA check
- "Got it, let's go!" dismisses overlay, drops user into Home tab
- "Don't show this again" checkbox writes `localStorage.setItem('onboarding_dismissed', 'true')`
- Warm, friendly tone — no tech jargon
- Full-screen overlay on cream background

## 5. Shared Interaction Patterns

### Buttons
- **Primary actions** (Uber, Maps): Teal background, white text, 48px height
- **Navigate buttons**: Terracotta text, right-aligned on cards, 44px tap target
- **Category filter pills**: Teal fill when active, outline when inactive

### Toast Notifications
- "Copied!" toast on wifi copy: appears bottom-center, auto-dismisses after 2s
- Warm-gray background, charcoal text, rounded corners

### Transitions
- Tab content: simple fade transition (CSS only, no animation library)
- Day pill switch: content swap, no slide animation
- Card interactions: subtle scale on tap (transform: scale(0.98))

### Offline Indicators
- If exchange rate is cached/stale: show "Last updated: [timestamp]" in muted text
- If GPS unavailable: swap "Sorted by distance" to "Sorted alphabetically"
- No error modals — graceful degradation with inline status text
