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
    console.log({ returnedRows })
    expect(returnedRows).to.have.lengthOf(5)
  })

  it('inserts all rows', () => {
    console.log(testRows.response.result)
    expect(testRows).to.have.lengthOf(5)
  })

  xit('inserts all fields', () => {})
})
