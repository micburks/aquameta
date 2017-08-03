const datumMiddleware = require('aquameta-express-middleware')
const { schema } = require('aquameta-datum')

const Connection = require('./Connection')
const datumRoutes = require('./Datum')
const pageMiddleware = require('./Page')
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

    /* Register middleware to look in database for resources */
    pages: true,

    /* Register server-side datum-from-request middleware */
    server: false,

    /* Client URL slug */
    url: 'endpoint',

    /* Client API version */
    version: 'v0.1',

    // cacheRequestMilliseconds: 5000, /* Client only? */

    /* Use sockets for events, upgraded connection */
    events: false,

    /* Cookie to store session id */
    sessionCookie: 'SESSION_ID',


    /* not sure about these next two */
    /* might be better somewhere else */


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

  if (config.client) {
    /* Register Client-side API route */
    app.use(datumRoutes(config))
  }

  if (config.pages) {
    /* Register middleware that looks for matching database-mounted resources */
    app.use(pageMiddleware(config))
  }

  if (config.server) {
    /* Add datum to the request object */
    app.use(datumMiddleware(config))
  }

  return datum
}

