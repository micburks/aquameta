import Endpoint from './Endpoint'
import Schema from './Schema'
import { curry, getOrCreate } from './utils'

const cache = {}
const defaultConfig = {
  url: 'endpoint',
  version: '0.1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false
}

/* TODO: server-side rendering is unsolved */

const getOrCreateSchema = curry((endpoint, name) => {
  const { url, version } = endpoint.config()
  const symbol = Symbol.for(`${url} v${version}`)
  const schemata = getOrCreate(symbol, cache)
  return getOrCreate(name, schemata, () => new Schema(endpoint, name))
})

const datum = config => {
  config = Object.assign(defaultConfig, config)
  const endpoint = Endpoint(config)
  const schema = getOrCreateSchema(endpoint)
  return { schema }
}

export { datum, getOrCreateSchema as schema, Endpoint as endpoint }
