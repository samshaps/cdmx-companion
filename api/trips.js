import { handleTrips } from '../server/trips.js'

export default { fetch: (request) => handleTrips(request) }
