import { handlePreview } from '../server/linkPreview.js'

export default { fetch: (request) => handlePreview(request) }
