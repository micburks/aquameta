const Endpoint = require('./Endpoint');
const Schema = require('./datum/Schema');
const uuid = require('./util/Uuid');

/*
 * TODOs
 * auth login - call function and set cookie
 * Request - map function call to endpoint.request argument object or to a url if client side
 * register Data routes
 * consider events/websocket... sockiet.io?
 * figure out auth role call - store user in env, instead of doing user lookup on every db hit
 * map db errors?
 * parse data url /endpoint/v1/schema/rel|func/...
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

const dataRoutes = require('./Data');
//const pageRoutes = require('./Page');

module.exports = app => {

    // Server side DB requests
    const endpoint = {
        connectionForRequest: Endpoint.connectionForRequest,
        request: Endpoint.request,
        schema: function(name) { return new Schema(this, name); },
        uuid
    };

    //console.log('endpoint', endpoint.connectionForRequest);

    // API routes
    dataRoutes(app, endpoint);

    // Probably not using
    //pageRoutes(app);

    return endpoint;
};
