const { resolve } = require('path')

module.exports = {
  importDir,
  exportTable
}

function importDir (path) {
  return Promise.resolve()
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
