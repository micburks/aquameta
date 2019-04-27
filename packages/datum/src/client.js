// @flow

import type {Client, ClientOptions} from './types.js';

const defaultConfig: ClientOptions = {
  url: 'endpoint',
  version: 'v1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false,
  rawResponse: false,
};

const ENDPOINT = new Object();
const CONNECTION = new Object();

export const isEndpointClient = (client: Client): boolean => {
  return client.type === ENDPOINT;
};

export const isConnectionClient = (client: Client): boolean => {
  return client.type === CONNECTION;
};

export const isInvalidClient = (client: Client): boolean =>
  !(isEndpointClient(client) || isConnectionClient(client));

export function endpoint(config?: ClientOptions): Client {
  return createClient(ENDPOINT, config);
}

export function connection(config?: ClientOptions): Client {
  return createClient(CONNECTION, config);
}

function createClient(type: Object, config: ?ClientOptions): Client {
  return {
    ...defaultConfig,
    ...config,
    type,
  };
}
