import { useMemo } from 'react'

export function useNowNext(events, dayDate) {
  return useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    if (dayDate !== today) return { nowIndex: -1, nextIndex: -1 }

    const now = new Date()
    let nextIndex = -1

    for (let i = 0; i < events.length; i++) {
      const [h, m] = events[i].time.split(':').map(Number)
      const eventTime = new Date()
      eventTime.setHours(h, m, 0, 0)

      if (eventTime > now) {
        nextIndex = i
        break
      }
    }

    if (nextIndex === -1) return { nowIndex: -1, nextIndex: -1 }

    let nowIndex = -1
    if (nextIndex > 0) {
      const prevEvent = events[nextIndex - 1]
      const [h, m] = prevEvent.time.split(':').map(Number)
      const prevTime = new Date()
      prevTime.setHours(h, m, 0, 0)
      const twoHoursMs = 2 * 60 * 60 * 1000

      if (now - prevTime <= twoHoursMs) {
        nowIndex = nextIndex - 1
      }
    }

    return { nowIndex, nextIndex }
  }, [events, dayDate])
}
