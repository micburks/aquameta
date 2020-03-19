// @flow

import type {Client, ClientOptions} from './types.js';

const defaultConfig: ClientOptions = {
  url: 'api',
  version: 'v1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false,
  rawResponse: false,
};

const ENDPOINT = Symbol.for('endpoint');
const CONNECTION = Symbol.for('connection');

export const isEndpointClient = (client: Client): boolean => {
  return client.type === ENDPOINT;
};

export const isConnectionClient = __NODE__
  ? (client: Client): boolean => {
      return client.type === CONNECTION;
    }
  : (client: Client) => false; // eslint-disable-line no-unused-vars

export const isInvalidClient = (client: Client): boolean =>
  !(isEndpointClient(client) || isConnectionClient(client));

export function endpoint(config?: ClientOptions): Client {
  return createClient(ENDPOINT, config);
}

export const connection = __NODE__
  ? function connection(config?: ClientOptions): Client {
      return createClient(CONNECTION, config);
    }
  : (client?: ClientOptions) => false; // eslint-disable-line no-unused-vars

function createClient(type: symbol, config?: ClientOptions): Client {
  return Object.assign({}, defaultConfig, config, {type});
}
