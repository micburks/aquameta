// @flow

import pg from 'pg';
import type {
  Client,
  ConnectionOptions,
  Executable,
  QueryResult,
} from '../types.js';

const anonConfig: ConnectionOptions = {
  user: 'anonymous',
  database: 'aquameta',
  host: 'localhost',
  port: 5432,
  max: 4,
  idleTimeoutMilliseconds: 30000,
};

type PgConnection = {
  connect: () => Promise<void>,
  query: (string, Array<any>) => Promise<QueryResult>,
  end: () => Promise<void>,
};

async function getConnection(config?: {
  [string]: any,
  connection?: {[string]: any},
}): Promise<PgConnection> {
  const mergedConfig = {
    ...anonConfig,
    ...((config && config.connection) || {}),
  };
  // Don't allow user to be overridden
  mergedConfig.user = anonConfig.user;
  const anonClient: PgConnection = new pg.Client(mergedConfig);

  await anonClient.connect();

  if (!mergedConfig.sessionId) {
    return anonClient;
  }

  let result;
  try {
    result = await anonClient.query(
      'select (role_id).name as role_name from endpoint.session where id = $1::uuid',
      [mergedConfig.sessionId],
    );
  } catch (e) {
    await anonClient.end();
    throw e;
  }

  // If login fails - continue request as anonymous
  if (!result || !result.rows || result.rows.length === 0) {
    return anonClient;
  }

  // Release Client - TODO: release back to pool
  await anonClient.end();

  // Logged in
  const userResult = new Result(result.rows[0]);
  const user = await userResult.json();
  console.log(`connection: logged in as ${user.role_name}`);
  const userClient = new pg.Client({
    ...mergedConfig,
    user: user.role_name,
  });
  await userClient.connect();
  return userClient;
}

/**
 * Execute query server-side
 * @returns {Promise}
 */
export default async function executeConnection(
  client: Client,
  query: Executable,
): Promise<QueryResult> {
  let connection;

  try {
    connection = await getConnection(client);

    let result;
    /*
    if (query.args && query.args.source) {
      const {schemaName, relationName, column, name} = parseSourceUrl(
        query.url,
      );
      const queryResult = await connection.query(
        `
        select content, mimetype
        from (select $1 as content, '$1' as extension from $3.$4 where name='$2') as c
        join endpoint.mimetype_extension me on c.extension=me.extension
        join endpoint.mimetype m on me.mimetype_id=m.id;
      `,
        [column, name, schemaName, relationName],
      );
      result = {...queryResult};
      if (result && result.rows && result.rows.length !== 0) {
        result.status = 200;
        result.message = 'OK';
      } else {
        result.status = 404;
        result.status = 'NOT FOUND';
      }
    } else {
      */
    console.log(
      'trying connection',
      query.version || client.version,
      query.method,
      query.url,
      JSON.stringify(query.args),
      JSON.stringify(query.data),
    );
    // $FlowFixMe
    result = await connection.query(
      'select status, message, response, mimetype ' +
        'from endpoint.request($1, $2, $3, $4::json, $5::json)',
      [
        query.version || client.version,
        query.method,
        query.url,
        JSON.stringify(query.args),
        JSON.stringify(query.data),
      ],
    );
    //}

    // TODO: end connection if userClient, but release if anonClient?
    await connection.end();

    const res = new Result(result.rows[0]);
    if (client.rawResponse) {
      return res;
    } else {
      return res.json().then(r => {
        return r.result.map(({row}) => row);
      });
    }
  } catch (e) {
    // Problem with connecting to database
    console.error(`connection: error trying to connect to database`);
    console.error(e);
    if (connection) {
      await connection.end();
    }
    return null;
  }
}

type ResultArgs = {
  status: string,
  message: string,
  response: string,
  mimetype: string,
};
// Mimic response from fetch
class Result {
  status: string;
  statusText: string;
  response: string;
  mimetype: string;
  constructor({status, message, response, mimetype}: ResultArgs) {
    this.status = status;
    this.statusText = message;
    this.response = response;
    this.mimetype = mimetype;
  }
  async json(): Promise<{[string]: any}> {
    return JSON.parse(this.response);
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

type ParsedSourceUrl = {
  schemaName: string,
  relationName: string,
  column: string,
  name: string,
};

export function parseSourceUrl(pathname: string): ParsedSourceUrl {
  const [, , schemaName, relationName, ...rest] = pathname.split('/');
  const fileName = rest.join('/');
  const lastPeriod = fileName.lastIndexOf('.');
  const name = fileName.slice(0, lastPeriod);
  const column = fileName.slice(lastPeriod + 1);

  return {schemaName, relationName, column, name};
}
