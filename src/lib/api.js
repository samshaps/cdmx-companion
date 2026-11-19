// Thin client for /api/trips. Failures come back as ApiError with the HTTP
// status (0 when the network itself failed) so callers can branch on it.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || 'Request failed')
    this.status = status
    this.body = body || {}
  }
}

async function request(url, { method = 'GET', token, passcode, body } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  if (passcode) headers['X-Trip-Passcode'] = passcode
  let res
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError(0, { error: 'offline' })
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

const tripUrl = (id) => `/api/trips?id=${encodeURIComponent(id)}`

export const createTrip = (basics) => request('/api/trips', { method: 'POST', body: basics })
export const fetchTrip = (id, { token, passcode } = {}) => request(tripUrl(id), { token, passcode })
export const previewStayLink = (id, token, url) =>
  request(`/api/preview?id=${encodeURIComponent(id)}`, { method: 'POST', token, body: { url } })
export const saveTrip = (id, token, doc, passcode) =>
  request(tripUrl(id), { method: 'PUT', token, body: passcode === undefined ? { doc } : { doc, passcode } })
