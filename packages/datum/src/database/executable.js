// @flow

import url from 'url';
import ramda from 'ramda';
import {
  DELETE,
  INSERT,
  SELECT,
  UPDATE,
  getMethodFromType,
} from './constants.js';
import type {Executable, HTTPRequest} from '../types.js';
import {addArg} from './args.js';
import {fn} from './chainable.js';
import type {SelectType} from './generated-types.js';

// TODO move this
import {parseSourceUrl} from '../query/connection.js';

const {__, compose, curry} = ramda;

const EXECUTABLE = Symbol.for('executable');

const createExecutable = curry<
  string,
  Executable<any>,
  {[string]: mixed},
  Executable<any>,
>(
  <T>(
    method: string,
    chainable: Executable<T>,
    data: ?{[string]: mixed},
  ): Executable<T> => ({
    method,
    url: chainable.url,
    args: chainable.args, // SELECT, UPDATE, DELETE use args
    version: chainable.version || null,
    data, // UPDATE and INSERT use data
    type: EXECUTABLE,
  }),
);

export function isInvalidExecutable(executable: Executable<any>): boolean {
  return !(executable.type === EXECUTABLE);
}

// $FlowFixMe
export const del = createExecutable<any>(
  getMethodFromType(DELETE),
  (__: any),
  null,
);
export const insert = createExecutable<any>(getMethodFromType(INSERT));
export const select = createExecutable<SelectType>(
  getMethodFromType(SELECT),
  (__: any),
  null,
);
export const update = createExecutable<any>(getMethodFromType(UPDATE));

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
export const http = __NODE__
  ? function http(req: HTTPRequest): ?Executable<any> {
      const parsed: ParsedUrl = url.parse(req.url, true);
      const {pathname} = parsed;

      if (pathname && sourceUrlRegex.test(pathname)) {
        // return createExecutable('GET', {url: pathname, args: {source: true}}, null);
        if (__NODE__) {
          const {schemaName, relationName, column, name} = parseSourceUrl(
            pathname,
          );
          const func = fn('endpoint.source', [
            schemaName,
            relationName,
            column,
            name,
          ]);
          // $FlowFixMe
          return compose(select, source)(func);
        }
      } else if (pathname) {
        // TODO: does something need to happen here with versions?
        /*
    const [, version] = /\/?(.+)\//.exec(pathname);
    console.log(version);
    */
        const path = pathname.replace(/\/?.+?\//, '');
        return createExecutable(
          req.method,
          {url: path, args: parsed.query || {}},
          req.body || null,
        );
      } else {
        return null;
      }
    }
  : null;
