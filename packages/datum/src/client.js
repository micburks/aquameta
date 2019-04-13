// @flow

import type {Client} from './types.js';
// import {CLIENT} from './database/constants.js';

type ClientOptions = {
  connection?: boolean,
  endpoint?: boolean,
  url?: string,
  version?: string,
  sessionCookie?: string,
  cacheRequestMilliseconds?: number,
  sockets?: boolean,
};

const defaultConfig: Client = {
  url: 'endpoint',
  version: 'v1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false,
};

export default function client(config?: ClientOptions): Client {
  return Object.assign({}, defaultConfig, config);
}

/* test calls */
/*
client({});
client();
client({connection: true});
*/
