const { createTestTable, dropTestTable, getTestRows } = require('./utils.js')
const { importDir } = require('../lib')

describe('import', () => {
  let testRows,
    returnedTables

  before(async () => {
    await dropTestTable()
    await createTestTable()
    returnedTables = await importDir('./test/data')
    testRows = await getTestRows()
  })

  it('returns an array of tables', () => {
    const [ table ] = returnedTables

    expect(table).to.have.all.keys(['table', 'rows'])
    expect(table.table).to.equal('test.user')
  })

  it('inserts returns inserted rows', () => {
    const { rows } = returnedTables[0]
    expect(rows).to.have.lengthOf(5)
  })

  it('inserts all rows', () => {
    const { result } = testRows.response
    expect(result).to.have.lengthOf(5)
  })

  it('inserts all fields', () => {
    const { row } = testRows.response.result[0]

    expect(row).to.have.all.keys(['name', 'age'])
    expect(row.name).to.equal(`mickey${row.age}`)
  })
})
