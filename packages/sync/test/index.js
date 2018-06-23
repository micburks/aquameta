const { dropTestTable, getTestRows } = require('./utils.js')
const { importDir } = require('../lib')

describe('import', () => {
  let testRows,
    returnedRows

  before(async () => {
    await dropTestTable()
    const rows = await getTestRows()

    if (rows.length !== 0) {
      throw new Error('test.user is not empty')
    }

    returnedRows = await importDir('./test.user')
    testRows = await getTestRows()
  })

  it('inserts returns inserted rows', () => {
    assert(returnedRows.length === 5)
  })

  it('inserts rows properly', () => {
    assert(testRows.length === 5)
  })
})
