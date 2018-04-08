import ramda from 'ramda'
import { CLIENT, EXECUTABLE } from '../database/constants.mjs'
import toFetch from './toFetch.mjs'
import toExecute from './toExecute.mjs'

const { compose, cond, curry, identity, T, when } = ramda

const usesEndpoint = client => client.endpoint
const usesConnection = client => client.connection
const execute = cond([
  [usesConnection, toExecute],
  [usesEndpoint, toFetch],
  [T, () => { throw new Error('must specify endpoint or connection for client') }]
])

const evented = client => client.evented
const makeEvented = identity

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
    if (!client[CLIENT]) {
      throw new TypeError('query: invalid client')
    }
    if (!query[EXECUTABLE]) {
      throw new TypeError('query: invalid executable')
    }

    try {
      return compose(
        when(evented, makeEvented),
        execute
      )(client, query)
    } catch (e) {
      console.error(e)
    }
  }
)
