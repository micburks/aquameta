// @flow

import url from 'url';
import {__, compose, curry} from 'ramda';
import {
  DELETE,
  INSERT,
  SELECT,
  UPDATE,
  getMethodFromType,
} from './constants.js';
import type {Executable, HTTPRequest} from '../types.js';
import {include, relation, where} from './chainable.js';
import {addArg} from './args.js';

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

// TODO
type ParsedUrl = {
  pathname?: string,
  query?: {[string]: mixed},
};

/**
 * parse http request and return executable
 *
 * e.g.
 * query(
 *   client.connection(),
 *   database.http(req)
 * ).then(...).catch(...)
 *
 *
 * source urls reference a field and therefore return a "file" with a mimetype
 * it doesn't make sense to have a database.source() function
 *
 * parse source url and return executable
 *
 * e.g.
 * query(
 *   client.connection(),
 *   database.source(req.url)
 * ).then(...).catch(...)
 *
 * on server:
 * doesnt make sense to use this on the server, you still need other information from http request
 * in that case, http can emcompass both functionalities and just figure out how to parse the request
 *
 * in browser:
 * from the client, you wouldn't want to use datum to get files. you would just use fetch or whatever
 * you normally use. source urls are meant to be compatible with current technologies, not accessed
 * thorugh datum
 */
// /db/schema/rel/name.column
const sourceUrlRegex = /^\/db\/.+\/.+\/.+\..+/;
const source = addArg('source', true);
export function http(req: HTTPRequest): Executable {
  const parsed: ParsedUrl = url.parse(req.url, true);
  const {pathname} = parsed;

  if (pathname && sourceUrlRegex.test(pathname)) {
    // TODO: analyze sourceUrl to find if its row/relation/field and query args
    const [, , schemaName, relationName, ...rest] = pathname.split('/');
    const fileName = rest.join('/');
    const lastPeriod = fileName.lastIndexOf('.');
    const name = fileName.slice(0, lastPeriod);
    const column = fileName.slice(lastPeriod + 1);
    const rel = relation(`${schemaName}.${relationName}`);

    return compose(
      select,
      source, // TODO?: need to identify this as a source request
      where('name', name),
      include(column),
    )(rel);
    /*
    return createExecutable(
      'GET',
      {url: `/${parsed.pathname.replace(sourceUrlRegex, '')}`, args: {}},
      null,
    );
    */
  } else {
    return createExecutable(
      req.method,
      {url: parsed.pathname, args: parsed.query || {}},
      req.body || null,
    );
  }
}
