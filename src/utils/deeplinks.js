export function getAppleMapsUrl(address) {
  return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`
}

export function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

export function getUberUrl(lat, lng, name) {
  return `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
}
