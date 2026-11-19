// Pulls a latitude/longitude out of whatever the organizer pastes: a plain
// "19.41, -99.17" pair or a full Google/Apple Maps link. Returns null when
// nothing usable is found (short share links carry no coordinates).
const PATTERNS = [
  /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // Google Maps place pin
  /@(-?\d+\.\d+),(-?\d+\.\d+)/, // Google Maps viewport
  /[?&](?:q|ll|query|destination|daddr|center)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i,
  /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/, // bare pair
]

export function parseCoordinates(input) {
  for (const pattern of PATTERNS) {
    const match = pattern.exec(input || '')
    if (!match) continue
    const lat = Number(match[1])
    const lng = Number(match[2])
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng }
  }
  return null
}
