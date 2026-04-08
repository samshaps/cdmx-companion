export function getAppleMapsUrl(address) {
  return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`
}

export function getGoogleMapsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

export function getUberUrl(addressLine1, addressLine2, lat, lng) {
  const drop = JSON.stringify({
    addressLine1,
    addressLine2,
    source: 'SEARCH',
    latitude: lat,
    longitude: lng,
    provider: 'uber_places',
  })
  return `https://m.uber.com/go/home?drop%5B0%5D=${encodeURIComponent(drop)}&effect=`
}
