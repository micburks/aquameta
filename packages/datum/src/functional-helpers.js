import curry from 'just-curry-it';

import type {Client, Executable, Query} from './types.js';

type Case = [(?any) => boolean, (any, ?any) => Query];

export const T = () => true;

export const getKey = curry((key, obj) => obj[key]);

export const when = (shouldRun, run) => {
  return (query: Query) => {
    if (shouldRun(query)) {
      return run(query);
    }
    return Promise.resolve(query);
  };
};

export function cond(cases: Array<Case>) {
  return (client: Client, query: Executable): Query => {
    const hit = cases.find(([shouldRun]) => shouldRun(client));
    if (hit) {
      return hit.run(client, query);
    }
    return Promise.reject(new Error('satisfying condition not found'));
  };
}
