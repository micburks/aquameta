const Connection = require('./Connection')
const Schema = require('./datum/Schema')
const datumRoutes = require('./Datum')
const debug = require('debug')('index')

/*
 * TODOs
 * auth login - call function and set cookie - wrapper?
 * consider events/websocket... sockiet.io?
 * map db errors?
 * parse data url /endpoint/v1/schema/rel|func/...
 * keep-open for server-side computation
 *
 * regarding auth role call
 * data requests are one db hit per request, so we can always just look up the user
 * with regular request, we dont want to check auth role with every db request
 *   the point of server-side logic is to do multiple requests and harder computation 
 *     this would suck if every db hit had to do an additional user lookup
 * we dont even want to do a user lookup with every HTTP request
 * we only want to lookup up user if we are going to hit the db on this request
 *   we could have the user manually call this lookup and just use anon role if they dont
 *   or we could somehow keep track of whether this HTTP request has hit the db
 *     yet and do the user lookup if they havent yet
 *
 *  OPTIONS
 *  * lookup with every HTTP request
 *  * lookup with every db hit
 *  * lookup if db hasn't been hit yet in this request
 *  * make user manually lookup
 *
 */


function datum() {

  /* ENDPOINT */
  /* Defines the routes for retrieving client-side data */
  /* Returns a function that can be used to retrieve database access server-side */

  /* need 3 entry mechanisms */
  /* 1. Configured in Node app HTTP request */
  /* 2. Bundled for client-side */
  /* 3. Configured from Webpack */

  let defaultConfig = {
    url: 'endpoint',
    version: 'v0.1',
    sessionCookie: 'SESSION_ID',
    cacheRequestMilliseconds: 5000,
    sockets: false
  }

  this.config = defaultConfig
  this._schema = {}
}

/* Client-side API */
// TODO: wait a second...
datum.prototype.schema = function( name ) {
  if ( !(name in this._schema) ) {
    this._schema[name] = new Schema(Connection(), name)
  }
  return this._schema[name]
}

datum.prototype.routes = function( config, app ) {

  this.config = Object.assign({}, this.config, config)

  /* Register Client-side API route */
  datumRoutes(app, this.config)

  // Probably using
  //pageRoutes(app)

  /* Server-side */
  return request => ({
    schema: name => new Schema(Connection(request), name)
  })
}

datum.prototype.connect = function( request ) {
  // TODO: check that this is an HTTP request
  return Connection(request)
}

module.exports = new datum()
