// @flow

import type {Client} from './types.js';

type ClientOptions = {
  connection?: boolean,
  endpoint?: boolean,
  url?: string,
  version?: string,
  sessionCookie?: string,
  cacheRequestMilliseconds?: number,
  sockets?: boolean,
};

const defaultConfig: ClientOptions = {
  url: 'endpoint',
  version: 'v1',
  sessionCookie: 'SESSION_ID',
  cacheRequestMilliseconds: 5000,
  sockets: false,
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
