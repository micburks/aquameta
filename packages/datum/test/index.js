const assert = require('assert')
const path = require('path')
const { client, database, query } = require('../dist/datum.js')

describe('query', function() {
  it('will throw with invalid client', function() {
    assert.throws(
      () => query({}, {}),
      Error
    )
  })

  it('will throw with invalid query datum', function() {
    assert.throws(
      () => query(client({}), {}),
      Error
    )
  })
