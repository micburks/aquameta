const { join, resolve } = require('path')
const { promisify } = require('util')
const fs = require('fs')
const { client, database: db, query } = require('aquameta-datum')
const { compose } = require('ramda')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

module.exports = {
  importDir,
  exportTable
}

const executeQuery = query(client({ connection: true }))

async function importDir (path) {
  path = resolve(path)

  const tables = (await readdir(path))
    .map(async table => {
      const tablePath = join(path, table)
      const rel = db.relation(table)
      const insertRow = compose(
        executeQuery,
        db.insert(rel)
      )

      let rows = (await readdir(tablePath))
        .map(async rowId => {
          const rowPath = join(tablePath, rowId)

          const columns = (await readdir(rowPath))
            .map(async name => {
              const fullPath = join(rowPath, name)
              let content = await readFile(fullPath, 'utf-8')

              // Remove new line at end of file
              if (content.charAt(content.length - 1) === '\n') {
                content = content.slice(0, -1)
              }

              return { [name]: content }
            })

          const fields = await Promise.all(columns)

          return insertRow(
            Object.assign({}, ...fields)
          )
        })

      return Promise.all(rows)
    })

  return Promise.all(tables)
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
