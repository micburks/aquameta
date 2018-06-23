const { compose } = require('ramda')
const { client, database: db, query } = require('aquameta-datum')

module.exports = {
  createTestTable,
  dropTestTable,
  getTestRows
}

const executeQuery = (...args) => {
  return query(client({ connection: true }))(...args)
    .then(res => {
      return Object.assign({}, res, {
        response: JSON.parse(res.response)
      })
    })
}
const metaSchemaRel = db.relation('meta.schema')
const metaTableRel = db.relation('meta.table')
const metaColumnRel = db.relation('meta.column')
const testUserRel = db.relation('test.user')

const testUserMetaRow = compose(
  db.where('schema_name', 'test'),
  db.where('name', 'user')
)(metaTableRel)

const testMetaRow = compose(
  db.where('name', 'test')
)(metaSchemaRel)

async function executeEach (...args) {
  for (let q of args) {
    await executeQuery(q)
  }
}

async function createTestTable () {
  await executeEach(
    db.insert(metaSchemaRel, { name: 'test' }),
    db.insert(metaTableRel, {
      schema_name: 'test',
      name: 'user'
    }),
    db.insert(metaColumnRel, {
      schema_name: 'test',
      relation_name: 'user',
      name: 'name',
      type_name: 'text'
    }),
    db.insert(metaColumnRel, {
      schema_name: 'test',
      relation_name: 'user',
      name: 'age',
      type_name: 'text'
    })
  )
}

async function dropTestTable () {
  await executeEach(
    db.del(testUserRel),
    db.del(testUserMetaRow),
    db.del(testMetaRow)
  )
}

function getTestRows () {
  return executeQuery(
    db.select(testUserRel)
  )
}
