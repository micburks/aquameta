// @flow

import datumRouter from './datumRouter.js';
import pageMiddleware from './pageMiddleware.js';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
// import debug from 'debug';
import type {ClientOptions, ConnectionOptions} from 'aquameta-datum';

const app = new Koa();
// const log = debug('index');

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

type Options = {
  [string]: any,
  connection: ConnectionOptions,
  client: ClientOptions,
};
const defaultConfig: Options = {
  pages: true,
  server: false,
  roles: false,
  node: false,
  client: {
    url: 'api',
    version: 'v1',
    cacheRequestMilliseconds: 5000,
    events: false,
    sessionCookie: 'SESSION_ID',
    rawResponse: true,
  },
  connection: {
    user: 'anonymous',
    database: 'aquameta',
  },
};

export default function(config: Options) {
  config = Object.assign({}, defaultConfig, config);

  if (config.client) {
    // Register Client-side API route
    const datum = datumRouter(config.client);

    app.use(bodyParser());
    app.use(datum.routes()).use(datum.allowedMethods());
  }

  if (config.pages) {
    // Register middleware that looks for matching database-mounted resources
    app.use(pageMiddleware(config.client));
  }

  if (config.node) {
    return app.callback();
  } else {
    return mount(app);
  }
}
