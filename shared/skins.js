// Colour skins. The app has three brand colours; a skin swaps them for the
// colours of a destination's flag, and washes the page and its cards in a
// pale tint of the third one so the change is obvious at a glance. Text
// colour never changes, surfaces always stay light, and every skin is nudged
// darker until it is readable on them, so no flag can produce an unusable
// screen.
//
//   primary    buttons, selected pills, headings' accents (white text sits on it)
//   accent     links and secondary actions (sits on the cream background)
//   highlight  the "Day 2 of 5!" counter and NOW badges

export const DEFAULT_SKIN = { primary: '#1A535C', accent: '#C2572B', highlight: '#E8A838' }

const BACKGROUND = '#FFF5E6'
const CARD = '#F0EBE3'

// Flag colours by name, so the destination table stays readable.
const NAMED = {
  red: '#C8102E', crimson: '#9E1B32', darkred: '#8A1116', coral: '#E8616D', maroon: '#7B1C2E',
  orange: '#E35205', saffron: '#FF9933', copper: '#B8621B', brown: '#6A4A3C', buff: '#D9B77A',
  gold: '#F2A900', yellow: '#FCD116',
  green: '#007A4D', darkgreen: '#006847', mint: '#3DAA75',
  turquoise: '#00778B', sky: '#4AA5E0', lightblue: '#6CACE4',
  blue: '#0055A4', royal: '#0038A8', navy: '#0A3161', darknavy: '#012169',
  purple: '#6A2C91', black: '#1A1A1A',
}

const HEX = /^#[0-9a-f]{6}$/i
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase()

function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

function darkenUntil(hex, against, ratio) {
  let rgb = channels(hex)
  for (let i = 0; i < 40 && contrast(toHex(rgb), against) < ratio; i++) rgb = rgb.map((c) => c * 0.93)
  return toHex(rgb)
}

const mix = (hex, other, amount) => toHex(channels(hex).map((c, i) => c + (channels(other)[i] - c) * amount))

// The page background and card colour a skin produces: white with a little
// of the highlight colour stirred in (cards get more, as in the original).
export function skinSurfaces(skin) {
  if (!skin) return { background: BACKGROUND, card: CARD }
  return { background: mix('#FFFFFF', skin.highlight, 0.22), card: mix('#FFFFFF', skin.highlight, 0.36) }
}

// Makes three colours safe to use as a skin: readable on the surfaces they
// will sit on.
export function makeSkin(primary, accent, highlight) {
  const safeHighlight = darkenUntil(highlight, '#FFFFFF', 1.8)
  const { card } = skinSurfaces({ highlight: safeHighlight })
  return {
    primary: darkenUntil(primary, card, 4.5),
    accent: darkenUntil(accent, card, 4),
    highlight: safeHighlight,
  }
}

// "navy red gold" → a skin.
export function skinFromNames(names) {
  const [primary, accent, highlight] = names.split(' ').map((name) => NAMED[name])
  return makeSkin(primary, accent, highlight)
}

// For skins arriving from outside (a saved trip, an import): null unless it
// is three real colours, and re-checked for readability either way.
export function normalizeSkin(input) {
  if (!input || ![input.primary, input.accent, input.highlight].every((c) => typeof c === 'string' && HEX.test(c))) return null
  return makeSkin(input.primary, input.accent, input.highlight)
}

export const sameSkin = (a, b) =>
  Boolean(a && b) && a.primary === b.primary && a.accent === b.accent && a.highlight === b.highlight

// CSS custom properties (as "r g b" so Tailwind's opacity modifiers work).
export function skinCssVars(skin) {
  const s = skin || DEFAULT_SKIN
  const rgb = (hex) => channels(hex).join(' ')
  const surfaces = skinSurfaces(skin)
  return {
    '--c-background': rgb(surfaces.background),
    '--c-card': rgb(surfaces.card),
    '--c-primary': rgb(s.primary),
    '--c-primary-light': rgb(skin ? mix(s.primary, '#FFFFFF', 0.45) : '#4ECDC4'),
    '--c-accent': rgb(s.accent),
    '--c-highlight': rgb(s.highlight),
  }
}
