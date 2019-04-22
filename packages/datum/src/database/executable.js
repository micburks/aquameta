// @flow

import url from 'url';
import {__, curry} from 'ramda';
import {
  DELETE,
  INSERT,
  SELECT,
  UPDATE,
  getMethodFromType,
} from './constants.js';
import type {Executable, HTTPRequest} from '../types.js';

const EXECUTABLE = new Object();

const createExecutable = curry<
  string,
  Executable,
  {[string]: mixed},
  Executable,
>(
  (
    method: string,
    chainable: Executable,
    data: ?{[string]: mixed},
  ): Executable => ({
    method,
    url: chainable.url,
    args: chainable.args, // SELECT, UPDATE, DELETE use args
    data, // UPDATE and INSERT use data
    type: EXECUTABLE,
  }),
);

export function isInvalidExecutable(executable: Executable): boolean {
  return !(executable.type === EXECUTABLE);
}

// $FlowFixMe
export const del = createExecutable(getMethodFromType(DELETE), (__: any), null);
export const insert = createExecutable(getMethodFromType(INSERT));
export const select = createExecutable(
  getMethodFromType(SELECT),
  (__: any),
  null,
);
export const update = createExecutable(getMethodFromType(UPDATE));

type ParsedUrl = {
  pathname?: string,
  query?: {[string]: mixed},
};

/**
 * Parse http request and return executable
 *
 * e.g.
 * query(
 *   client.connection(),
 *   database.http(req)
 * ).then(...).catch(...)
 *
 * http requests are either datum calls or source urls
 * source urls return a single column and have the format: /db/schema/rel/name.column
 */
const sourceUrlRegex = /^\/db\/.+\/.+\/.+\..+/;
export function http(req: HTTPRequest): Executable {
  const parsed: ParsedUrl = url.parse(req.url, true);
  const {pathname} = parsed;

  if (pathname && sourceUrlRegex.test(pathname)) {
    return createExecutable('GET', {url: pathname, args: {source: true}}, null);
  } else {
    return createExecutable(
      req.method,
      {url: parsed.pathname, args: parsed.query || {}},
      req.body || null,
    );
  }
}
