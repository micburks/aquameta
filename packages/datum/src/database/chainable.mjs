import ramda from 'ramda'

const { cond, curry, identity, T } = ramda

export function relation (name) {
  let [ schemaName, relationName ] = name.split('.')
  if (!relationName) {
    relationName = schemaName
    schemaName = 'public'
  }

  return {
    schemaName,
    relationName,
    url: `relation/${schemaName}/${relationName}`,
    args: {}
  }
}

const isFalsy = val => !val
const isArray = arr => (arr instanceof Array)

const asArray = arr => cond([
  [isFalsy, () => ([])],
  [isArray, identity],
  [T, val => ([val])]
])

/*
const push = (arr, item) => {
  arr.push(item)
  return arr
}
*/

const concat = (arr, item) => ([...arr, item])

// (any, any, any) => any
const identity2of3 = (v1, v2, v3) => v2

// (str, any, obj) => [any]
const concatObjKey = (key, value, obj) => concat(asArray(obj[key]), value)

// (fn, str, any, obj) => any
const setKey = curry((functor, key, value, obj) => {
  obj[key] = functor(key, value, obj)
  return obj
})

// TODO: need to create new object with new args
// const seKey = (key, value, chainable) => setKey(functor, key, value, chainable.args)

// (fn, str, str, any) => any
const applyArgs = curry((fn, op, name, value) => fn({ name, op, value }))

// (str, any, obj) => obj
const addArg = setKey(identity2of3)
const addArrayArg = setKey(concatObjKey)

/**
 * operations to perform on relation return value
 *
 * CANNOT be called on executable
 */
const addWhere = applyArgs(addArrayArg('where'))
export const where = addWhere('=')
export const whereEquals = where
export const whereNot = addWhere('<>')
export const whereNotEquals = whereNot
export const whereGt = addWhere('>')
export const whereGte = addWhere('>=')
export const whereLt = addWhere('<')
export const whereLte = addWhere('<=')
export const whereLike = addWhere('like')
export const whereSimilarTo = addWhere('similar to')
export const whereNull = addWhere('is null')
export const whereNotNull = addWhere('is not null')

const addOrder = addArg('order')
export const order = addOrder
export const orderBy = order
export const orderByAsc = addOrder('asc')
export const orderByDesc = addOrder('desc')
export const orderRandom = addOrder('random()')

export const limit = addArg('limit')

export const offset = addArg('offset')

export const evented = addArg('evented')
export const metaData = addArg('metaData')

export const exclude = addArrayArg('exclude')
export const excludeColumn = exclude
export const include = addArrayArg('include')
export const includeColumn = include

// For functions... ?
export const args = {}
