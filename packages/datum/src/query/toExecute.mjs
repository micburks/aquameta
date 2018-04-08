import pg from 'pg'

const anonConfig = {
  user: 'mickey',
  password: null,
  database: 'aquameta',
  host: 'localhost',
  port: 5432,
  max: 4,
  idleTimeoutMilliseconds: 30000
}

async function verifySession (config) {
  const client = new pg.Client(anonConfig)

  if (!client.sessionId) {
    return client
  }

  await client.connect()

  const result = await client.query(
    'select (role_id).name as role_name from endpoint.session where id = $1::uuid',
    [ client.sessionId ]
  )

  // Logged in
  console.log('connection: logged in', result.rows.length, result.rows)

  if (result.rows.length === 0) {
    throw new Error('connection: login failed')
  }

  // Release Client
  await client.end()

  // Copy anonymous config and modify user
  const userConfig = Object.assign({}, anonConfig, { user: result.rows[0].role_name })
  console.log('connection: configs -', userConfig, anonConfig)

  return new pg.Client(userConfig)
}

/**
 * Execute query server-side
 * @returns {Promise}
 */
export default async function toExecute (client, query) {
  let connection

  try {
    connection = await verifySession(client)
    await connection.connect()

    console.log('trying connection', client.version, query.method, query.url, JSON.stringify(query.args), JSON.stringify(query.data))
    let result = await connection.query(
      'select status, message, response, mimetype ' +
      'from endpoint.request($1, $2, $3, $4::json, $5::json)', [
        client.version,
        query.method,
        query.url,
        JSON.stringify(query.args),
        JSON.stringify(query.data)
      ]
    )

    await connection.end()

    return result.rows[0]
  } catch (e) {
    // Problem logging in
    console.error(`connection: ${e.message}`)
    await connection.end()

    return null
  }
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
