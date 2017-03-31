import { Connection } from './Connection'
import { Schema } from './datum/Schema'
import { datumRoutes } from './Datum'
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

/* Usage
 * const app = require('express')();
 * const endpoint = require('./node-datum')(app, optionalConfig)
 * app.get('/contact', (req, res) =>
 *      endpoint.schema(...).table(...).rows().then(res.send));
 */
module.exports = ( app, config ) => {

  /* ENDPOINT */
  /* Defines the routes for retrieving client-side data */
  /* Returns a function that can be used to retrieve database access server-side */

  const {
    url = '/endpoint',
    version = 'v1',
    sessionCookie = 'SESSION_ID'
  } = config

  /*
    datum(req).schema('meta').table('relation').rows();
    let db = datum(req);
    let db = database(req);
    let endpoint = connect(req);
    let database = connection(req);
    let database = endpoint(req);
    let database = connectionForRequest(req);
    let endpoint = endpointForRequest(req);
    */

  /* Server-side API */
  const datum = request => ({
    schema: name => new Schema(Connection(request, config), name)
  })

  /* If app is supplied... */
  /* Register Client-side API route */
  if(app) datumRoutes(app, config)

  // Probably not using
  //pageRoutes(app)

  // Return Server-side API
  return datum

}

