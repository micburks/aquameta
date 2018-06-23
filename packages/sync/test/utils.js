const { compose } = require('ramda')
const { client, database: db, query } = require('aquameta-datum')

module.exports = {
  createTestTable,
  dropTestTable,
  getTestRows
}

const executeQuery = query(client({ connection: true }))
const metaRelationRel = db.relation('meta.relation')
const metaSchemaRel = db.relation('meta.schema')
const testUserRel = db.relation('test.user')

const testUserMetaRow = compose(
  db.where('schema_name', 'test')
  db.where('name', 'user')
)(metaRelationRel)

const testMetaRow = compose(
  db.where('name', 'test')
)(metaSchemaRel)

async function executeEach (...args) {
  for (let q of arg) {
    await executeQuery(q)
  }
}

async function createTestTable () {
  await executeEach(
    db.insert(metaSchemaRel, { name: 'test' }),
    db.insert(metaRelationRel, {
      schema_name: 'test'
      name: 'user'
    })
  )
}

async function dropTestTable () {
  await executeEach(
    db.delete(testUserRel),
    db.delete(testUserMetaRow),
    db.delete(testMetaRow)
  )
}

function getTestRows () {
  return executeQuery(
    db.select(testUserRel)
  )
}
