/* globals describe it require before expect */

const {createTestTable, dropTestTable, getTestRows} = require('./utils.js');
const {importDir} = require('../lib');

describe('import', () => {
  let testRows, returnedTables;

  before(async () => {
    await dropTestTable();
    await createTestTable();
    returnedTables = await importDir('./test/data');
    testRows = await getTestRows();
  });

  it('returns an array of tables', () => {
    const [table] = returnedTables;
    const tables = returnedTables.map(({table}) => table);

    expect(table).to.have.all.keys(['table', 'rows']);
    expect(tables).to.have.all.members(['test.user', 'test.no-data']);
  });

  it('inserts returns inserted rows', () => {
    const {rows} = returnedTables.find(({table}) => table === 'test.user');
    expect(rows).to.have.lengthOf(5);
  });

  it('inserts all rows', () => {
    expect(testRows).to.have.lengthOf(5);
  });

  it('inserts all fields', () => {
    const row = testRows[0];

    expect(row).to.have.all.keys(['name', 'age', 'id']);
    expect(row.name).to.equal(`mickey${row.age}`);
  });
});
