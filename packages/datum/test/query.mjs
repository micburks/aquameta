import chai from 'chai'
import { describe } from './utils.mjs'
import { client, database, query } from '../src/server-index.mjs'

const { assert } = chai
const { it, xit } = describe('query')

it('will throw with invalid client', async function () {
  try {
    await query({}, {})
  } catch (e) {
    assert.instanceOf(e, TypeError)
    assert.include(e.message, 'client')
  }
})

it('will throw with invalid query datum', async function () {
  try {
    await query(client({}), {})
  } catch (e) {
    assert.instanceOf(e, TypeError)
    assert.include(e.message, 'executable')
  }
})

it('will not throw with sane input', async function () {
  const rel = database.relation('widget.widget')
  const exec = database.select(rel)
  await query(client({}), exec)
  assert(true)
})

xit('will execute db connection', function () {
})

xit('will execute fetch', function () {
})
