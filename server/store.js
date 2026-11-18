// Key-value storage for trips. In production this is Upstash Redis (added
// from the Vercel Marketplace), spoken to over its REST API so no client
// library is needed. With no Redis configured, local development falls back
// to a JSON file so `npm run dev` works with zero setup.
import fs from 'node:fs'
import path from 'node:path'

function upstashStore(url, token) {
  async function call(pathname, body) {
    const res = await fetch(url.replace(/\/$/, '') + pathname, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok || data.error) throw new Error(`Store error: ${data.error || res.status}`)
    return data
  }
  return {
    async get(key) {
      const { result } = await call('/', ['GET', key])
      return result ? JSON.parse(result) : null
    },
    async set(key, value, ttlSeconds) {
      await call('/', ['SET', key, JSON.stringify(value), 'EX', ttlSeconds])
    },
    // Counts hits in a time window; used for rate limiting.
    async increment(key, windowSeconds) {
      const results = await call('/pipeline', [['INCR', key], ['EXPIRE', key, windowSeconds, 'NX']])
      return results[0].result
    },
  }
}

function fileStore(file) {
  const read = () => {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return {} }
  }
  const write = (data) => {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, JSON.stringify(data))
  }
  const live = (entry) => entry && entry.expiresAt > Date.now()
  return {
    async get(key) {
      const entry = read()[key]
      return live(entry) ? entry.value : null
    },
    async set(key, value, ttlSeconds) {
      const data = read()
      data[key] = { value, expiresAt: Date.now() + ttlSeconds * 1000 }
      write(data)
    },
    async increment(key, windowSeconds) {
      const data = read()
      const entry = live(data[key]) ? data[key] : { value: 0, expiresAt: Date.now() + windowSeconds * 1000 }
      entry.value += 1
      data[key] = entry
      write(data)
      return entry.value
    },
  }
}

export class StoreNotConfiguredError extends Error {}

export function getStore(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) return upstashStore(url, token)
  // Deployed without a database: the filesystem is read-only, so say so
  // clearly instead of failing on the first write.
  if (env.VERCEL) throw new StoreNotConfiguredError('No database is connected to this deployment')
  return fileStore(env.LOCAL_STORE_PATH || path.resolve('.data/store.json'))
}
