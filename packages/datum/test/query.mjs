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

xit('will not throw with sane input', async function () {
  const rel = database.relation('widget.widget')
  const exec = database.select(rel)
  await query(client({ connection: true }), exec)

  assert(true)
})

it('will execute db connection', async function () {
  const rel = database.relation('bundle.commit')
  const executeConnection = query(
    client({
      connection: true
    })
  )

  const rows = await executeConnection(
    database.select(rel)
  )
  const response = JSON.parse(rows.response).result

  assert.typeOf(response, 'array')
})

xit('will execute fetch', function () {
})
