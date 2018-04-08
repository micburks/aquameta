import chai from 'chai'
import { describe } from '../utils.mjs'
import { relation } from '../../src/database/chainable.mjs'

const { assert } = chai
const { it, xit } = describe('database/relation')

it('#relation', 'throws when no arguments provided', function () {
  assert.throws(relation, TypeError)
})

it('#relation', 'parses schema and relation names from argument', function () {
  const rel = relation('endpoint.session')
  assert.equal(rel.schemaName, 'endpoint')
  assert.equal(rel.relationName, 'session')
})

it('#relation', 'adds `public` schema when no schema provided', function () {
  const rel = relation('widget')
  assert.equal(rel.schemaName, 'public')
  assert.equal(rel.relationName, 'widget')
})
