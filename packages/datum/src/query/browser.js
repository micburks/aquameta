/* global location fetch Headers */
import { always, compose, cond, curry, T, when } from 'ramda'
import toFetch from './toFetch'

const usesEndpoint = client => client.endpoint
const usesConnection = client => client.connection
const evented = client => client.evented
const establishConnection = client => cond([
  [usesConnection,  toFetch],
  [T,               () => { throw new Error('must specify endpoint or connection for client') }]
])

/**
 * query
 *
 * Execute the given query with a client
 *
 * @curried
 * @params {Client} client
 * @params {ExecutableQuery} query
 * @returns {Promise}
 */
export default curry(
  async function (client, query) {
    if (!(client instanceof Client)) {
      throw new Error('query: invalid client')
    }

    let promise

    try {
      promise = compose(
        when(evented, eventResult),
        execute
        establishConnection
      )(client, query)
    } catch (e) {
      console.error(e)
    }

    return promise
  }
)
