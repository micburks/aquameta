import Endpoint from './Endpoint'
import Schema from './Schema'

const defaultConfig = {
  url: 'endpoint',
  version: 'v0.1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false
}

export default datum = {
  schema: name => new Schema(Endpoint(config), name)
}
