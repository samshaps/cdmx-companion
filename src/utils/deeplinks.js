export function getAppleMapsUrl(address) {
  return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`
}

export function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

export function getUberUrl(nickname, lat, lng) {
  const params = new URLSearchParams({
    action: 'setPickup',
    'pickup': 'my_location',
    'dropoff[latitude]': lat,
    'dropoff[longitude]': lng,
    'dropoff[nickname]': nickname,
  })
  return `https://m.uber.com/ul/?${params.toString()}`
}
