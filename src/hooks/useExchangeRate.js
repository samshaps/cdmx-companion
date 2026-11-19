import { useState, useEffect } from 'react'

const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours
const API_BASE = 'https://open.er-api.com/v6/latest'

function getCached(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setCache(key, rate) {
  localStorage.setItem(key, JSON.stringify({ rate, timestamp: Date.now() }))
}

// Rate is expressed as: 1 unit of `home` = `rate` units of `local`.
export function useExchangeRate(home, local) {
  const [rate, setRate] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let canceled = false

    async function fetchRate() {
      const cacheKey = `exchange_rate_${home}_${local}`
      const cached = getCached(cacheKey)

      // Use cache if fresh
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (!canceled) {
          setRate(cached.rate)
          setLastUpdated(cached.timestamp)
          setLoading(false)
        }
        return
      }

      // Fetch fresh rate
      try {
        const res = await fetch(`${API_BASE}/${home}`)
        const data = await res.json()
        if (data.result === 'success' && data.rates?.[local]) {
          const fresh = data.rates[local]
          setCache(cacheKey, fresh)
          if (!canceled) {
            setRate(fresh)
            setLastUpdated(Date.now())
            setLoading(false)
          }
          return
        }
      } catch {
        // fetch failed — fall through to cached fallback
      }

      // Fallback to stale cache
      if (cached) {
        if (!canceled) {
          setRate(cached.rate)
          setLastUpdated(cached.timestamp)
          setLoading(false)
        }
        return
      }

      // No cache, no network
      if (!canceled) {
        setError('No exchange rate available')
        setLoading(false)
      }
    }

    fetchRate()
    return () => { canceled = true }
  }, [home, local])

  return { rate, lastUpdated, loading, error }
}
