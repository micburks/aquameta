const fs = require('fs')
const { join } = require('path')
const { compose } = require('ramda')
const { promisify } = require('util')
const { client, database: db, query } = require('aquameta-datum')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

module.exports = readTables

const executeQuery = query(
  client({ connection: true })
)

async function readTables (path) {
  const tables = (await readdir(path))
    .map(async table => {
      const tablePath = join(path, table)
      const rel = db.relation(table)
      const insertRow = compose(
        executeQuery,
        db.insert(rel)
      )

      return Promise.all(
        await readRows(tablePath, insertRow)
      )
    })

  return tables
}

async function readRows (path, insert) {
  const rows = (await readdir(path))
    .map(async rowId => {
      const rowPath = join(path, rowId)
      const columns = await readColumns(rowPath)

      return insert(
        Object.assign({}, ...columns)
      )
    })

  return rows
}

async function readColumns (path) {
  const columns = (await readdir(path))
    .map(async name => {
      const fullPath = join(path, name)
      let content = await readFile(fullPath, 'utf-8')

      // Remove new line at end of file
      if (content.charAt(content.length - 1) === '\n') {
        content = content.slice(0, -1)
      }

      return { [name]: content }
    })

  return Promise.all(columns)
}
