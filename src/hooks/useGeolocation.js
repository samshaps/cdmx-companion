import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const supported = typeof navigator !== 'undefined' && !!navigator.geolocation
  const [error, setError] = useState(supported ? null : 'Geolocation not supported')
  const [loading, setLoading] = useState(supported)

  useEffect(() => {
    if (!supported) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [supported])

  return { position, error, loading }
}
