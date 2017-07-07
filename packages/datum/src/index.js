import Endpoint from './Endpoint'
import Schema from './Schema'

const cache = {}
const defaultConfig = {
  url: 'endpoint',
  version: '0.1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false
}

/* TODO: server-side rendering is unsolved */

const curry = fn => {
  const len = fn.length
  const cb = (...args) => {
    return args.length >= len ? fn(...arguments) : cb.bind(null, ...args)
  }
  return cb.apply(null, arguments)
}

const getOrCreateSchema = curry((endpoint, name) => {
  const { url, version } = endpoint.config()
  const symbol = Symbol.for(`${url} v${version}`)
  const schemata = cache[symbol]
  if (!(name in schemata)) {
    schemata[name] = new Schema(endpoint, name)
  }
  return schemata[name]
})

const datum = config => {
  config = Object.assign(defaultConfig, config)
  const endpoint = Endpoint(config)
  const schema = getOrCreateSchema(endpoint)
  return { schema }
}

export { datum, getOrCreateSchema as schema, Endpoint as endpoint }
