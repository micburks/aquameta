import { compose } from 'ramda'
import { client, database, query } from 'aquameta-datum'

const fetchQuery = query(client({ endpoint: true }))

export const select = compose(
  fetchQuery,
  database.select
)

export const insert = compose(
  fetchQuery,
  database.insert
)

export const update = compose(
  fetchQuery,
  database.update
)

export const del = compose(
  fetchQuery,
  database.del
)
