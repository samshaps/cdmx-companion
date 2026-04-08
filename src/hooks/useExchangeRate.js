import { useState, useEffect } from 'react'

const CACHE_KEY = 'exchange_rate'
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours
const API_URL = 'https://open.er-api.com/v6/latest/USD'

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setCache(rate) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }))
}

export function useExchangeRate() {
  const [rate, setRate] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRate() {
      const cached = getCached()

      // Use cache if fresh
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (!cancelled) {
          setRate(cached.rate)
          setLastUpdated(cached.timestamp)
          setLoading(false)
        }
        return
      }

      // Fetch fresh rate
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        if (data.result === 'success' && data.rates?.MXN) {
          const mxnRate = data.rates.MXN
          setCache(mxnRate)
          if (!cancelled) {
            setRate(mxnRate)
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
        if (!cancelled) {
          setRate(cached.rate)
          setLastUpdated(cached.timestamp)
          setLoading(false)
        }
        return
      }

      // No cache, no network
      if (!cancelled) {
        setError('No exchange rate available')
        setLoading(false)
      }
    }

    fetchRate()
    return () => { cancelled = true }
  }, [])

  return { rate, lastUpdated, loading, error }
}
