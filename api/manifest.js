import { handleManifest } from '../server/trips.js'

export default { fetch: (request) => handleManifest(request) }
