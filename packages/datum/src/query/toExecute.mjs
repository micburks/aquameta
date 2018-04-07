/**
 * Execute query server-side
 * @returns {Promise}
 */
export default function toExecute (query, connection) {
  connection.then(client => {
    console.log('trying connection', query.config.version, query.method, query.metaId, JSON.stringify(query.args), JSON.stringify(query.data))
    return client.query(
      'select status, message, response, mimetype ' +
      'from endpoint.request($1, $2, $3, $4::json, $5::json)', [
        query.config.version,
        query.method,
        query.metaId,
        JSON.stringify(query.args),
        JSON.stringify(query.data)
      ])
      .then(result => {
        // release client
        // client.release()

        result = result.rows[0]
        if (result.status >= 400) throw result
        return result
      }).catch(err => {
        if (client.release) client.release()
        console.error('error in endpoint.request query', err)
      })
  })
}

  /*
import pg from 'pg'
import { fromDatum, toExecute } from 'aquameta-query'
*/

const anonConfig = {
  user: 'anonymous',
  password: null,
  database: 'aquameta',
  host: 'localhost',
  port: 5432,
  max: 4,
  idleTimeoutMilliseconds: 30000
}

/**
 * TODO I want to keep track of how many pools are open and when they connect
 * pg-pool has some great events
 * pool.on('connect', client => {
 *   client.count = count++
 * })
 */

/**
 * TODO in order to do this, I would have to keep track of the open pools,
 * instead of doing it with pg.connect()
 *
 * var pool = new pg.Pool(config)
 * pool.connect(callback)
 * 
 * is the same as
 *
 * pg.connect(config, callback)
 *
 * and this way, pg will keep track of the pools and not create a new one when
 * the same config has been passed in twice
*/

export class Connection {
  constructor (config, request) {
    this.config = config
    this.connection = this.config.connection
    this.request = request
  }

  // TODO: what happens when request is not passed in
  // connection override

  query (method) {
    return (metaId, args, data) => {
      // let query = new Query(config)
      fromDatum(method, metaId, args, data)
      return toExecute(this.connect())
    }
  }

  /**
   * Verifying the role connected to the database is required for each query attempt
   * This overhead is small compared to the benefits of row-level permissions
   * @returns {promise}
   */
  verifySession () {
    const req = this.request
    // get cookies
    console.log(req.headers, req.headers.cookie)
    // TODO
    // May need to pull out session_id from cookies without using 3rd party library
    // in the case that the user hasn't installed it
    // OR
    // Require user to install body-parser and cookie-parser
    return pg.connect(anonConfig)
      .then(client => {
        return client.query(
          'select (role_id).name as role_name from endpoint.session where id = $1::uuid',
          [ req.cookies.session_id ])
          .then(result => {
            // Logged in
            console.log('connection: result -', result.rows.length, result.rows)

            if (result.rows.length === 0) {
              throw new Error('login failed')
            }

            // Release Client
            client.release()

            // Copy anonymous config and modify user
            let userConfig = Object.assign({}, anonConfig, { user: result.rows[0].role_name })
            console.log('connection: configs -', userConfig, anonConfig)

            return pg.connect(userConfig)
          })
          .catch(err => {
            // Problem logging in
            console.error('connection: error -', err)

            // Return client for next query
            return client
          })
      })
  }

  /**
   * @returns {promise}
   */
  get () {
    return this.query('GET')
  }

  /**
   * @returns {promise}
   */
  post () {
    return this.query('POST')
  }

  /**
   * @returns {promise}
   */
  patch () {
    return this.query('PATCH')
  }

  /**
   * @returns {promise}
   */
  delete () {
    return this.query('DELETE')
  }

  /**
   * @returns {promise}
   */
  connect () {
    if (!this.config.roles) {
      return pg.connect(this.connection)
    }
    return this.verifySession()
  }
}
