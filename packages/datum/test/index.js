const assert = require('assert')
const path = require('path')
const { database, schema, endpoint } = require('../dist/datum.js')

describe('datum', function() {
  it('will return the api with a default endpoint', function() {
    assert(typeof database({}).schema === 'function')
  })

  it('will create the endpoint with the given config', function() {
    const config = {
      url: 'abc',
      version: '1million',
      sessionCookie: 'a cooler cookie',
      cacheRequestMilliseconds: 2222,
      sockets: true
    }

    const expected = JSON.stringify(config)
    const actual = JSON.stringify(database(config).schema('name').endpoint.config())
    assert(expected === actual)
  })
})

describe('schema', function() {
  it('will reuse endpoints with the same url and version', function() {
    const schema_name = 'schema_name'
    const db = endpoint({ url: 'a', version: '0' })
    const expected = schema(db, schema_name)
    const actual = schema(db, schema_name)
    assert(expected === actual)
  })
})
