const Connection = require('./Connection')
const datumRoutes = require('./Datum')
const pages = require('./Page')
const debug = require('debug')('index')
const Schema = require('aquameta-datum/src/Schema')

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

module.exports = function( config, app ) {

  /* ENDPOINT */
  /* Defines the routes for retrieving client-side data */
  /* Returns a function that can be used for database access server-side */

  /* need 3 entry mechanisms */
  /* 1. Configured in Node app HTTP request */ /* aquameta           */
  /* 2. Bundled for client-side */            /*  aquameta-datum    */
  /* 3. Configured from Webpack */           /*   aquameta w/admin */

  const defaultConfig = {
    url: 'endpoint',
    version: 'v0.1',
    sessionCookie: 'SESSION_ID',
    cacheRequestMilliseconds: 5000,
    events: false,
    client: true,
    pages: true
  }

  config = Object.assign({}, defaultConfig, config)

  /* Server-side */
  const datum = request => {
    const connection = Connection(request)
    return {
      schema: name => new Schema(connection, name),
      connect: connection.connect
    }
  }

  if (app && config.client) {
    /* Register Client-side API route */
    datumRoutes(app, config)
  }
  
  if (app && config.pages) {
    /* Register middleware that looks for matching database-mounted resources */
    pages(app)
  }

  return datum
}
