export function getAppleMapsUrl(address) {
  return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`
}

export function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

export function getUberUrl(addressLine1, addressLine2, lat, lng) {
  const address = `${addressLine1}, ${addressLine2}`
  const params = new URLSearchParams({
    action: 'setPickup',
    'pickup': 'my_location',
    'dropoff[formatted_address]': address,
    'dropoff[latitude]': lat,
    'dropoff[longitude]': lng,
  })
  return `https://m.uber.com/ul/?${params.toString()}`
}
