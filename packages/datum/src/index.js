import Endpoint from './Endpoint'
import Schema from './Schema'

const defaultConfig = {
  url: 'endpoint',
  version: '0.1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false
}

/* TODO: server-side rendering is unsolved */
export default function datum( config ) {
  // Object.assign
  this.config = Object.keys(config).reduce((acc, key) => {
    return acc[key] = config[key]
  }, defaultConfig)
  this._schema = {}
}

datum.prototype.schema = function( name ) {
  if ( !(name in this._schema) ) {
    this._schema[name] = new Schema(Endpoint(this.config), name)
  }
  return this._schema[name]
}
