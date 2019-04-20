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
/**
 * DOESN'T allow chainables to be called on executables
 */
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
    args: chainable.args,
    data,
    type: EXECUTABLE,
  }),
);

export function isInvalidExecutable(executable: Executable): boolean {
  return !(executable.type === EXECUTABLE);
}

/**
 * turn relation into executable
 */
// $FlowFixMe
export const del = createExecutable(getMethodFromType(DELETE), (__: any), null);
export const insert = createExecutable(getMethodFromType(INSERT));
export const select = createExecutable(
  getMethodFromType(SELECT),
  (__: any),
  null,
);
export const update = createExecutable(getMethodFromType(UPDATE));

/**
 * parse http request and return executable
 *
 * e.g.
 * query(
 *   client.connection(),
 *   database.http(req)
 * ).then(...).catch(...)
 */
const sourceUrlRegex = /^\/db\//;

// TODO
type ParsedUrl = {
  pathname?: string,
  query?: {[string]: mixed},
};

export function http(req: HTTPRequest): Executable {
  const parsed: ParsedUrl = url.parse(req.url, true);

  if (parsed.pathname && sourceUrlRegex.test(parsed.pathname)) {
    // TODO: analyze sourceUrl to find if its row/relation/field and query args
    return createExecutable(
      'GET',
      {url: `/${parsed.pathname.replace(sourceUrlRegex, '')}`, args: {}},
      null,
    );
  } else {
    return createExecutable(
      req.method,
      {url: parsed.pathname, args: parsed.query || {}},
      req.body,
    );
  }
}

/**
 * parse source url and return executable
 *
 * e.g.
 * query(
 *   client.connection(),
 *   database.source(req.url)
 * ).then(...).catch(...)
 *
 * doesnt make sense to use this on the server, you still need other information from http request
 * in that case, http can emcompass both functionalities and just figure out how to parse the request
 *
 * from the client, you wouldn't want to use datum to get files. you would just use fetch or whatever
 * you normally use. source urls are meant to be compatible with current technologies, not accessed
 * thorugh datum
 */
