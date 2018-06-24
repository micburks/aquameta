const { resolve } = require('path')
const readTables = require('./readTables.js')

module.exports = {
  importDir,
  exportTable
}

async function importDir (path) {
  path = resolve(path)

  return Promise.all(
    await readTables(path)
  )
}

function exportTable (table) {
  if (typeof table !== 'string') {
    throw new Error('table argument must be of type `string`')
  }

  const [ schema, relation ] = table.split('.')

  if (!relation) {
    throw new Error('table argument must be schema-qualified, i.e. `schema.relation`')
  }

  return Promise.resolve()
}
