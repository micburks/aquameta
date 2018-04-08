import ramda from 'ramda'
import chai from 'chai'
import { describe } from '../utils.mjs'
import {
  relation,
  order, orderByAsc, orderByDesc, orderRandom,
  limit, offset,
  evented, metaData,
  exclude, include,
  args
} from '../../src/database/chainable.mjs'

const { compose } = ramda
const { assert } = chai
const { it, xit } = describe('database/chainable')
const rel = relation('widget.widget')

it('#order', 'adds proper object to args', function () {
  const column = 'name'
  const direction = 'asc'

  const query = compose(
    order(direction, column)
  )(rel)

  assert.typeOf(query.args.order, 'array')
  assert.equal(query.args.order[0].column, column)
  assert.equal(query.args.order[0].direction, direction)
})

it('#limit', 'adds value to args', function () {
  const value = '5'

  const query = compose(
    limit(value)
  )(rel)

  assert.equal(query.args.limit, value)
})

it('#limit', 'throws on invalid input', function () {
  const value = null

  const query = compose(
    limit(value)
  )(rel)

  assert.throws(() => query(rel), TypeError)
})
