import { CLIENT } from './database/constants.js'

const defaultConfig = {
  url: 'endpoint',
  version: 'v1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false
}

type Client = {
  url: String,
  version: String,
  sessionCookie: String,
  cacheRequestMilliseconds: Number,
  sockets: Boolean,
}

export default function client (config): Client {
  return Object.assign(
    { [CLIENT]: true },
    defaultConfig,
    config
  )
}
