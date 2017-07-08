const Connection = require('./Connection')
const datumRoutes = require('./Datum')
const pages = require('./Page')
const debug = require('debug')('index')
const { schema } = require('aquameta-datum')

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

    /* Register client routes for datum */
    client: true,

    /* Client URL slug */
    url: 'endpoint',

    /* Client API version */
    version: 'v0.1',

    // cacheRequestMilliseconds: 5000, /* Client only? */

    /* Register middleware to look in database for resources */
    pages: true,

    /* Use sockets for events, upgraded connection */
    events: false,

    /* Cookie to store session id */
    sessionCookie: 'SESSION_ID',

    /* Use supplied connection instead of roles */
    roles: true,
    //roles: false,

    /* Connection override */
    connection: null
    /*
    connection: {
      user: 'aquameta',
      password: 'datum',
      database: 'aquameta'
    }
    */
  }

  config = Object.assign({}, defaultConfig, config)
  let datum

  /* Not using Postgres role authentication */
  if (config.connection) {
    const connection = Connection(config)
    datum = {
      schema: name => new Schema(connection, name),
      connect: connection.connect
    }
  }

  /* Postgres role received in HTTP request */
  else {
    datum = request => {
      const connection = Connection(config, request)
      return {
        schema: name => new Schema(connection, name),
        connect: connection.connect
      }
    }
  }

  if (app && config.client) {
    /* Register Client-side API route */
    datumRoutes(config, app)
  }
  
  if (app && config.pages) {
    /* Register middleware that looks for matching database-mounted resources */
    pages(config, app)
  }

  return datum
}
