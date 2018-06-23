const { createTestTable, dropTestTable, getTestRows } = require('./utils.js')
const { importDir } = require('../lib')

describe('import', () => {
  let testRows,
    returnedRows

  before(async () => {
    await dropTestTable()
    await createTestTable()
    returnedRows = await importDir('./test.user')
    testRows = await getTestRows()
  })

  it('inserts returns inserted rows', () => {
    assert(returnedRows.length === 5)
  })

  it('inserts all rows', () => {
    assert(testRows.length === 5)
  })

  xit('inserts all fields', () => {})
})
