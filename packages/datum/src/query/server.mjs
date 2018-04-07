import ramda from 'ramda'
import { CLIENT, EXECUTABLE } from '../database/constants.mjs'
import toFetch from './toFetch.mjs'
import toExecute from './toExecute.mjs'

const { compose, cond, curry, identity, T, when } = ramda

const usesEndpoint = client => client.endpoint
const usesConnection = client => client.connection
const evented = client => client.evented
const makeEvented = identity
const execute = identity
const establishConnection = client => cond([
  [usesEndpoint, toExecute],
  [usesConnection, toFetch],
  [T, () => { throw new Error('must specify endpoint or connection for client') }]
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
    if (!client[CLIENT]) {
      throw new TypeError('query: invalid client')
    }
    if (!query[EXECUTABLE]) {
      throw new TypeError('query: invalid executable')
    }

    let promise

    try {
      promise = compose(
        when(evented, makeEvented),
        execute,
        establishConnection
      )(client, query)
    } catch (e) {
      console.error(e)
    }

    return promise
  }
)
