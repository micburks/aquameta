import executable from './executable'
import { __, curry } from 'ramda'
import { getMethodFromType } from './constants'
import { DELETE, INSERT, SELECT, UPDATE } from './constants'

/**
 * DOESN'T allow chainables to be called on executables
 */
const executable = curry((type, chainable, data) => ({
  method: getMethodFromType(type)
  url: chainable.url,
  args: chainable.args,
  data
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
export default function http (req) {
  return {
    method: req.method,
    url: req.url.split('?')[0],
    args: req.query,
    data: req.body
  }
}

/**
 * returns executable
 */
export default function source (sourceUrl) {
  const method = 'GET'
  const url = `/${sourceUrl.replace(/\/db\//, '')}`
  const args = {} // ?
  const data = {}

  // TODO: analyze sourceUrl to find if its row/relation/field and query args

  return {
    method,
    url,
    args,
    data
  }
}
