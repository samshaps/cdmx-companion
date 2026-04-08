export function getAppleMapsUrl(lat, lng) {
  return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
}

export function getGoogleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export function getUberUrl(lat, lng, name) {
  return `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
}
