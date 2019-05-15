import executeEndpoint from './endpoint.js';
import executeConnection from './connection.js';
import {compose, cond, curry, when, T} from 'ramda';
import {
  isConnectionClient,
  isEndpointClient,
  isInvalidClient,
} from '../client.js';
import {isInvalidExecutable} from '../database/index.js';

import type {Client, Executable, Query} from '../types.js';

/**
 * query
 *
 * Execute the given query with a client
 *
 * @curried
 * @params {Client} client
 * @params {ExecutableQuery} query
 * @returns {Promise}
 */
export default curry(async function(client: Client, query: Executable): Query {
  // Runtime validations
  if (isInvalidClient(client)) {
    throw new TypeError('query: invalid client');
  }
  if (isInvalidExecutable(query)) {
    throw new TypeError('query: invalid executable');
  }

  try {
    const res = await invoke(client, query);
    return res;
  } catch (e) {
    console.error(e);
  }
});

// TODO
const makeEvented = i => i;

const execute = cond(
  [
    __NODE__ && [isConnectionClient, executeConnection],
    [isEndpointClient, executeEndpoint],
    [
      T,
      () => {
        throw new Error('must specify endpoint or connection for client');
      },
    ],
  ].filter(Boolean),
);

const getKey = curry((key, obj) => obj[key]);

const invoke = compose(
  when(getKey('evented'), makeEvented),
  execute,
);
