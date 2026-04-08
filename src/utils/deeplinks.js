const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)

export function getNavigateUrl(lat, lng) {
  return isIOS()
    ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export function getUberUrl(lat, lng, name) {
  return `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
}
