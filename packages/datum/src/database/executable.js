import url from 'url';
import {__, curry} from 'ramda';
import {
  DELETE,
  EXECUTABLE,
  INSERT,
  SELECT,
  UPDATE,
  getMethodFromType,
} from './constants.js';

/**
 * DOESN'T allow chainables to be called on executables
 */
const executable = curry((type, chainable, data) => ({
  method: getMethodFromType(type),
  url: chainable.url,
  args: chainable.args,
  data,
  [EXECUTABLE]: true,
}));

/**
 * turn relation into executable
 */
export const del = executable(DELETE, __, null);
export const insert = executable(INSERT);
export const select = executable(SELECT, __, null);
export const update = executable(UPDATE);

/**
 * parse http request and return executable
 *
 * e.g.
 * query(
 *   client.connection(),
 *   database.http(req)
 * ).then(...).catch(...)
 */
export function http(req) {
  const parsed = url.parse(req.url, true);

  return {
    method: req.method,
    url: parsed.pathname,
    args: parsed.query || {},
    data: req.body,
    [EXECUTABLE]: true,
  };
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
export function source(sourceUrl) {
  const method = 'GET';
  const url = `/${sourceUrl.replace(/\/db\//, '')}`;
  const args = {}; // ?
  const data = {};

  // TODO: analyze sourceUrl to find if its row/relation/field and query args

  return {
    method,
    url,
    args,
    data,
    [EXECUTABLE]: true,
  };
}
