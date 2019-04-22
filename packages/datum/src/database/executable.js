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
      source,
      where('name', name),
      include(column),
    )(rel);
  } else {
    return createExecutable(
      req.method,
      {url: parsed.pathname, args: parsed.query || {}},
      req.body || null,
    );
  }
}
