import {createTestTable, dropTestTable, getTestRows} from './utils.js';
import {importDir} from '../lib/index.js';
import {describe} from 'these-are-tests';
import {expect} from 'chai';

const {it} = describe('import');

async function before() {
  await dropTestTable();
  await createTestTable();
  return {
    returnedTables: await importDir('./test/data'),
    testRows: await getTestRows(),
  };
}

it('returns an array of tables', async () => {
  const {returnedTables} = await before();

  const [table] = returnedTables;

  const tables = returnedTables.map(({table: t}) => t);

  expect(table).to.have.all.keys(['table', 'rows']);
  expect(tables).to.have.all.members(['test.user', 'test.no-data']);
});

it('inserts returns inserted rows', async () => {
  const {returnedTables} = await before();

  const {rows} = returnedTables.find(({table}) => table === 'test.user');

  expect(rows).to.have.lengthOf(5);
});

it('inserts all rows', async () => {
  const {testRows} = await before();

  expect(testRows).to.have.lengthOf(5);
});

it('inserts all fields', async () => {
  const {testRows} = await before();

  const row = testRows[0];
  expect(row).to.have.all.keys(['name', 'age', 'id']);
  expect(row.name).to.equal(`mickey${row.age}`);
});
