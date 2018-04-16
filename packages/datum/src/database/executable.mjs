import url from 'url'
import { __, curry } from 'ramda'
import { DELETE, EXECUTABLE, INSERT, SELECT, UPDATE, getMethodFromType } from './constants.mjs'

/**
 * DOESN'T allow chainables to be called on executables
 */
const executable = curry((type, chainable, data) => ({
  method: getMethodFromType(type),
  url: chainable.url,
  args: chainable.args,
  data,
  [EXECUTABLE]: true
}))

/**
 * turn relation into executable
 */
export const del = executable(DELETE, __, null)
export const insert = executable(INSERT)
export const select = executable(SELECT, __, null)
export const update = executable(UPDATE)

/**
 * returns executable
 */
export function http (req) {
  const parsed = url.parse(req.url, true)

  return {
    method: req.method,
    url: parsed.pathname,
    args: parsed.query || {},
    data: req.body,
    [EXECUTABLE]: true
  }
}

/**
 * returns executable
 */
export function source (sourceUrl) {
  const method = 'GET'
  const url = `/${sourceUrl.replace(/\/db\//, '')}`
  const args = {} // ?
  const data = {}

  // TODO: analyze sourceUrl to find if its row/relation/field and query args

  return {
    method,
    url,
    args,
    data,
    [EXECUTABLE]: true
  }
}
