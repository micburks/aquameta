import browserQuery from './query/browser.mjs'
import serverQuery from './query/server.mjs'
import client from './client.mjs'
import database from './database/index.mjs'

const query = __NODE__ ? serverQuery : browserQuery;

export { client, database, query  }
