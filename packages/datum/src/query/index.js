import executeEndpoint from './endpoint.js';
import executeConnection from './connection.js';
import {compose, cond, curry, when, T} from 'ramda';
import {getKey} from './functional-helpers.js';
import {isValidClient} from '../client.js';

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
  if (!isValidClient(client)) {
    throw new TypeError('query: invalid client');
  }
  if (!query[EXECUTABLE]) {
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
    [getKey('connection'), executeConnection],
    __NODE__ && [getKey('endpoint'), executeEndpoint],
    [
      T,
      () => {
        throw new Error('must specify endpoint or connection for client');
      },
    ],
  ].filter(Boolean),
);

const invoke = compose(
  when(getKey('evented'), makeEvented),
  execute,
);
