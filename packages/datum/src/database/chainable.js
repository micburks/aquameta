export default function relation (name) {
  const [ schemaName, relationName ] = name.split('.')
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
 * operations to perform on relation return value
 *
 * CANNOT be called on executable
 */
export const where = {}
export const whereEquals = where
export const whereNot = {}
export const whereNotEquals = whereNot
export const whereGt = {}
export const whereGte = {}
export const whereLt = {}
export const whereLte = {}
export const whereLike = {}
export const whereSimilarTo = {}
export const whereNull = {}
export const whereNotNull = {}

export const order = {}
export const orderBy = order
export const orderByAsc = {}
export const orderByDesc = {}
export const orderRandom = {}

export const limit = {}

export const offset = {}

export const evented = {}
export const metaData = {}

export const exclude = {}
export const excludeColumn = {}
export const include = {}
export const includeColumn = {}

// For functions... ?
export const args = {}
