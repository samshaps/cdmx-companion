# Story 1.4: iOS Safari Onboarding Overlay

Status: review

## Story

As a **family member on an iPhone**,
I want clear instructions for adding this to my home screen,
So that I can install it without asking for help.

## Acceptance Criteria

1. **Given** the user is on iOS Safari and NOT in standalone PWA mode and has NOT previously dismissed the overlay **When** the app loads **Then** a full-screen overlay appears on cream background with: Mexico flag emoji, "La Familia CDMX" title (Playfair Display), friendly intro text, and 3 numbered steps (tap Share, tap "Add to Home Screen", tap "Add")
2. **And** a "Got it, let's go!" button (48px tall, teal bg, white text, bold) dismisses the overlay
3. **Given** the user taps "Got it, let's go!" **When** the overlay is dismissed **Then** `localStorage.setItem('onboarding_dismissed', 'true')` is set **And** the user sees the Home tab
4. **Given** the user has previously dismissed the overlay (localStorage flag exists) **When** the app loads **Then** the overlay is NOT shown
5. **Given** the user is on Android, desktop, or already in standalone PWA mode **When** the app loads **Then** the overlay is NOT shown

## Tasks / Subtasks

- [x] Task 1: Create platform detection utility (AC: #4, #5)
  - [x] 1.1: Create `src/utils/platform.js` with `isIOSSafari()` function — checks for iOS Safari UA AND not standalone mode via `window.navigator.standalone` (Safari-specific) and `window.matchMedia('(display-mode: standalone)').matches`
  - [x] 1.2: Export a `shouldShowOnboarding()` function that combines: isIOSSafari() AND localStorage `onboarding_dismissed` !== 'true'
- [x] Task 2: Create OnboardingOverlay component (AC: #1, #2)
  - [x] 2.1: Create `src/components/OnboardingOverlay.jsx` — full-screen fixed overlay on cream background
  - [x] 2.2: Render Mexico flag emoji (large), "La Familia CDMX" title in Playfair Display, friendly intro paragraph
  - [x] 2.3: Render 3 numbered steps inside a Card component (reuse existing `Card.jsx`): (1) Share button instruction with share icon hint, (2) "Add to Home Screen" instruction, (3) Tap "Add" instruction
  - [x] 2.4: Render "Got it, let's go!" CTA button — 48px tall, full-width, teal bg (`bg-teal`), white text, bold, rounded
- [x] Task 3: Implement dismissal logic (AC: #2, #3)
  - [x] 3.1: On "Got it, let's go!" tap: write `localStorage.setItem('onboarding_dismissed', 'true')`, then hide overlay via state
  - [x] 3.2: The overlay should manage its own visibility state (`useState`) initialized by `shouldShowOnboarding()`
- [x] Task 4: Integrate into App.jsx (AC: all)
  - [x] 4.1: Import and render `<OnboardingOverlay />` in `App.jsx` — it self-manages visibility, so just render it unconditionally and let the component decide whether to show
  - [x] 4.2: Verify overlay renders above all other content when visible (use `fixed inset-0 z-50`)

## Dev Notes

### Architecture Requirements
- **Language:** JavaScript (JSX) — NO TypeScript
- **Styling:** Tailwind CSS utility classes inline — no separate CSS files
- **Components:** Functional components with hooks. Named exports for components.
- **Keep components small** — under 80 lines. The overlay is simple enough for a single component file.
- **State:** React useState only. No external state management.

### Platform Detection Logic

The overlay must ONLY appear when ALL of these are true:
1. Running on iOS (check UA: `/iPad|iPhone|iPod/.test(navigator.userAgent)`)
2. Running in Safari (NOT in-app browsers — check for Safari UA without CriOS/FxiOS/EdgiOS)
3. NOT in standalone PWA mode — check BOTH:
   - `window.navigator.standalone !== true` (Safari-specific property)
   - `!window.matchMedia('(display-mode: standalone)').matches` (standard)
4. `localStorage.getItem('onboarding_dismissed') !== 'true'`

**IMPORTANT:** `navigator.standalone` is Safari-specific and the primary check for iOS. The `display-mode: standalone` media query is a fallback/complement.

### iOS Safari UA Detection

```js
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
```

### Component Structure

```
src/
  utils/
    platform.js          # NEW — isIOSSafari(), shouldShowOnboarding()
  components/
    OnboardingOverlay.jsx # NEW — full-screen overlay component
    Card.jsx             # EXISTS — reuse for the steps container
  App.jsx                # MODIFY — add <OnboardingOverlay />
```

### UX Specifications (from UX Design doc section 4.4)

- **Background:** Cream (#FFF5E6) full-screen, fixed position
- **Mexico flag:** Use emoji (large, centered at top)
- **Title:** "La Familia CDMX" in Playfair Display (`font-display`), centered
- **Intro text:** Warm/friendly tone — "Your family trip companion app. Add it to your home screen to use it like a real app!"
- **Steps card:** Use existing Card component (warm-gray bg), 3 numbered steps:
  1. "Tap the Share button at the bottom of Safari" (include share icon visual cue — use a unicode arrow or emoji)
  2. "Scroll down and tap 'Add to Home Screen'"
  3. "Tap 'Add' in the top right"
  4. Follow-up: "That's it! Open it from your home screen anytime."
- **CTA button:** "Got it, let's go!" — 48px tall, `bg-teal text-white font-bold`, full-width, rounded-card, centered
- **Tone:** Warm and friendly. No tech jargon. This is for family members aged 55-70+ who are comfortable with phones but won't dig through settings.

### Design System Tokens (already configured in Tailwind)

Use these existing Tailwind classes — do NOT create new CSS:
- `bg-cream` — page/overlay background
- `bg-teal` — CTA button
- `text-charcoal` — body text
- `font-display` — Playfair Display for title
- `bg-warm-gray rounded-card shadow-card` — via Card component
- `text-teal` — accent text if needed

### Previous Story Intelligence (Story 1.1)

- **Card.jsx exists** at `src/components/Card.jsx` — accepts `children` and optional `className` prop. Uses `bg-warm-gray rounded-card shadow-card p-4`. REUSE this for the steps container.
- **Tailwind config** has all 7 design tokens, custom `rounded-card`, `shadow-card`, `font-display`. No additional config needed.
- **CSS custom properties** defined in `src/index.css` (`:root` block). No changes needed.
- **Google Fonts** loaded in `index.html` — Playfair Display and DM Sans already available.
- **trip.json** exists with all trip data including `trip.name: "La Familia CDMX"`.
- **App.jsx** currently renders a design system proof page. The overlay should render on top of whatever App renders.
- **No TabBar exists yet** (Story 1.2). The overlay doesn't depend on tabs — it's a full-screen overlay that shows before anything else.

### What NOT to Do
- Do NOT create a "Don't show this again" checkbox — the UX design shows one but the acceptance criteria say the CTA button itself sets localStorage. The button IS the dismissal mechanism.
  - **Correction based on UX doc:** The UX wireframe shows BOTH a "Got it, let's go!" button AND a "Don't show this again" checkbox. However, the acceptance criteria (AC #2, #3) only mention the button dismissal + localStorage. **Follow the acceptance criteria** — the button tap both dismisses and persists. No separate checkbox needed.
- Do NOT modify the TabBar or navigation (Story 1.2 scope)
- Do NOT add PWA configuration (Story 1.3 scope)
- Do NOT add animation libraries — CSS transitions only if any transitions are used
- Do NOT create a separate CSS file for this component
- Do NOT install any new dependencies

### Testing Guidance
- Test on iOS Safari (real device or simulator) to verify the overlay appears
- Test on Chrome/Firefox/Android to verify the overlay does NOT appear
- Test that dismissing persists — reload and verify overlay stays hidden
- Test in standalone PWA mode to verify overlay does NOT appear
- Test by clearing localStorage to verify overlay reappears

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/ux-design.md#4.4 Onboarding Overlay] — Full wireframe and behavior spec
- [Source: _bmad-output/planning-artifacts/architecture.md#5.4 Platform Detection] — iOS detection pattern
- [Source: _bmad-output/planning-artifacts/project-context.md#Dependencies Philosophy] — Native browser APIs preferred
- [Source: _bmad-output/planning-artifacts/project-context.md#Code Style] — JSX, functional components, named exports

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Build verified: 28 modules transformed, 67.66KB gzipped JS (under 80KB budget), no errors

### Completion Notes List

- Created `src/utils/platform.js` with `isIOSSafari()` and `shouldShowOnboarding()` — detects iOS Safari (excluding in-app browsers via CriOS/FxiOS/EdgiOS check), standalone mode (both Safari-specific `navigator.standalone` and standard `display-mode` media query), and localStorage dismissal flag
- Created `src/components/OnboardingOverlay.jsx` — self-contained overlay component that manages its own visibility via `useState` initialized by `shouldShowOnboarding()`. Renders Mexico flag emoji, Playfair Display title, friendly intro, 3 numbered steps inside reused Card component, and 48px teal CTA button
- Dismissal writes `localStorage.setItem('onboarding_dismissed', 'true')` and hides overlay via state — no separate checkbox, button is the sole dismissal mechanism per AC
- Integrated into App.jsx with unconditional render — component self-manages visibility. Uses `fixed inset-0 z-50` to render above all content
- All 5 acceptance criteria satisfied

### Change Log

- 2026-04-08: Story 1.4 implemented — iOS Safari onboarding overlay

### File List

- src/utils/platform.js (new — platform detection utility)
- src/components/OnboardingOverlay.jsx (new — onboarding overlay component)
- src/App.jsx (modified — added OnboardingOverlay import and render)
