// Local-timezone YYYY-MM-DD (toISOString would give the UTC date, which is
// wrong for "is this event today?" checks in the evening west of Greenwich).
export function localISODate(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return localISODate(d)
}

export function daysBetween(isoA, isoB) {
  const a = new Date(isoA + 'T12:00:00')
  const b = new Date(isoB + 'T12:00:00')
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}
