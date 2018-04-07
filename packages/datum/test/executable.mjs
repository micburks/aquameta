import chai from 'chai'
import { describe } from './utils.mjs'
import { database } from '../src/server-index.mjs'

const { assert } = chai
const { it, xit } = describe('executable http')

it('http is defined', function () {
  assert.equal(database.http, {})
})
