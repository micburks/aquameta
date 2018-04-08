import { compose } from 'ramda'
import chai from 'chai'
import { describe } from '../utils.mjs'
import {
  relation,
  where, whereNot,
  whereGt, whereGte,
  whereLt, whereLte,
  whereLike, whereNotLike,
  whereSimilarTo, whereNotSimilarTo,
  whereNull, whereNotNull,
} from '../../src/database/chainable.mjs'

const { assert } = chai
const { it, xit } = describe('database/chainable')
const rel = relation('widget.widget')

function assertWhere (where, name, op, value) {
  assert.typeOf(where, 'object')
  assert.equal(where.name, name)
  assert.equal(where.op, op)
  assert.equal(where.value, value)
}

it('#where', 'equals', 'adds proper where object to args', function () {
  const name = 'name'
  const op = '='
  const value = 'my_widget'

  const query = compose(
    where(name, value)
  )(rel)

  assert.typeOf(query.args.where, 'array')
  assertWhere(query.args.where[0], name, op, value)
})

it('#where', 'equals', 'adds to existing where array', function () {
  const name = 'html'
  const op = '='
  const value = '<template></template>'

  const query = compose(
    where(name, value),
    where('name', 'my_widget')
  )(rel)

  assertWhere(query.args.where[1], name, op, value)
})

it('#where', 'notEquals', 'adds proper where object to args', function () {
  const name = 'name'
  const op = '<>'
  const value = 'my_widget'

  const query = compose(
    whereNot(name, value)
  )(rel)

  assertWhere(query.args.where[0], name, op, value)
})

it('#where', 'Gt', 'adds proper where object to args', function () {
  const name = 'name'
  const op = '>'
  const value = 'my_widget'

  const query = compose(
    whereGt(name, value)
  )(rel)

  assertWhere(query.args.where[0], name, op, value)
})

it('#where', 'Lt', 'adds proper where object to args', function () {
  const name = 'name'
  const op = '<'
  const value = 'my_widget'

  const query = compose(
    whereLt(name, value)
  )(rel)

  assertWhere(query.args.where[0], name, op, value)
})

it('#where', 'like', 'adds proper where object to args', function () {
  const name = 'name'
  const op = 'like'
  const value = '%my_widget'

  const query = compose(
    whereLike(name, value)
  )(rel)

  assertWhere(query.args.where[0], name, op, value)
})

it('#where', 'similarTo', 'adds proper where object to args', function () {
  const name = 'name'
  const op = 'similar to'
  const value = '%my_widget'

  const query = compose(
    whereSimilarTo(name, value)
  )(rel)

  assertWhere(query.args.where[0], name, op, value)
})

it('#where', 'null', 'adds proper where object to args', function () {
  const name = 'name'
  const op = 'is'
  const value = null

  const query = compose(
    whereNull(name)
  )(rel)

  assertWhere(query.args.where[0], name, op, value)
})
