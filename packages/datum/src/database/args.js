import { cond, curry, identity, T } from 'ramda'

// (a) => bool
const isFalsy = val => !val

// (a) => bool
const isArray = arr => (arr instanceof Array)

// (a|[a]) => [a]
const asArray = cond([
  [isFalsy, () => ([])],
  [isArray, identity],
  [T, val => ([val])]
])

// ([a], [b]) => [a, b]
const concat = (val1, val2) => [...val1, ...val2]

// (fn, str, str) => any
const applyOrderArgs = curry((fn, direction, column) => fn({ column, direction }))

// (fn, str, str, any) => any
const applyWhereArgs = curry((fn, op, name, value) => fn({ name, op, value }))

// (fn, str, any, chainable) => chainable
const setProp = curry((functor, clause, val, chainable) => {
  if (!(chainable && chainable.args)) {
    throw new TypeError('chainable: invalid chainable')
  }

  return {
    ...chainable,
    args: {
      ...chainable.args,
      [clause]: functor(chainable.args[clause], val)
    }
  }
})

// (a, b) => b
const valIdentity = (previous, val) => val

// (a|[a], b|[b]) => [a, b]
const concatAsArrays = (val1, val2) => concat(asArray(val1), asArray(val2))

// (str, any, chainable) => chainable
export const addArg = setProp(valIdentity)
export const addArrayArg = setProp(concatAsArrays)

// (str, str, chainable) => chainable
export const addOrder = applyOrderArgs(addArrayArg('order'))

// (str, str, any, chainable) => chainable
export const addWhere = applyWhereArgs(addArrayArg('where'))
