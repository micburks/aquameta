import { CLIENT } from './database/constants.mjs'

const defaultConfig = {
  url: 'endpoint',
  version: '0.1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false
}

export default function (config) {
  return Object.assign(
    { [CLIENT]: true },
    defaultConfig,
    config
  )
}
