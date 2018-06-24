const { createTestTable, dropTestTable, getTestRows } = require('./utils.js')
const { importDir } = require('../lib')

describe('import', () => {
  let testRows,
    returnedRows

  before(async () => {
    await dropTestTable()
    await createTestTable()
    returnedRows = await importDir('./test/data')
    testRows = await getTestRows()
  })

  it('inserts returns inserted rows', () => {
    const result = returnedRows[0]
    expect(result).to.have.lengthOf(5)
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
