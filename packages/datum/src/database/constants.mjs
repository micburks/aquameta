import { always, cond, equals, T } from 'ramda'

export const CLIENT = Symbol('client')
export const EXECUTABLE = Symbol('executable')

export const DELETE = 'DELETE'
export const INSERT = 'INSERT'
export const SELECT = 'SELECT'
export const UPDATE = 'UPDATE'

export const HTTP = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const getMethodFromType = cond([
  [equals(DELETE), always(HTTP.DELETE)],
  [equals(INSERT), always(HTTP.POST)],
  [equals(SELECT), always(HTTP.GET)],
  [equals(UPDATE), always(HTTP.PUT)],
  [T, type => { throw new TypeError(`unknown type: ${type}`) }]
])
