import { __ } from 'ramda'
import { addArg, addArrayArg, addOrder, addWhere } from './args.mjs'

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

/**
 * Operations to perform on chainable (returned from relation)
 */
export const where = addWhere('=')
export const whereEquals = where
export const whereNot = addWhere('<>')
export const whereNotEquals = whereNot
export const whereGt = addWhere('>')
export const whereGte = addWhere('>=')
export const whereLt = addWhere('<')
export const whereLte = addWhere('<=')
export const whereLike = addWhere('like')
export const whereNotLike = addWhere('not like')
export const whereSimilarTo = addWhere('similar to')
export const whereNotSimilarTo = addWhere('not similar to')
export const whereNull = addWhere('is', __, null)
export const whereNotNull = addWhere('is not', __, null)

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
