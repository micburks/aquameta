import {createTestTable, dropTestTable, getTestRows} from './utils.js';
import {importDir} from '../lib/index.js';
import {describe, createLock} from 'these-are-tests';
import assert from 'assert';

const {it} = describe('import');

async function setup() {
  await dropTestTable();
  await createTestTable();
  return {
    returnedTables: await importDir('./test/data'),
    testRows: await getTestRows(),
  };
}

const lock = createLock();

it('returns an array of tables', async () => {
  const done = await lock();
  const {returnedTables} = await setup();

  const [table] = returnedTables;

  const tables = returnedTables.map(({table: t}) => t);

  assert.deepStrictEqual(
    Object.keys(table),
    ['table', 'rows'],
    'returns table and rows',
  );
  assert.deepStrictEqual(
    tables,
    ['test.no-data', 'test.user'],
    'inserts all tables',
  );
  done();
});

it('inserts returns inserted rows', async () => {
  const done = await lock();
  const {returnedTables} = await setup();

  const {rows} = returnedTables.find(({table}) => table === 'test.user');

  assert.equal(rows.length, 5, 'all rows inserted');
  done();
});

it('inserts all rows', async () => {
  const done = await lock();
  const {testRows} = await setup();

  assert.equal(testRows.length, 5, 'all rows inserted');
  done();
});

it('inserts all fields', async () => {
  const done = await lock();
  const {testRows} = await setup();

  const row = testRows[0];
  assert.deepStrictEqual(
    Object.keys(row),
    ['name', 'age', 'id'],
    'inserts all columns',
  );
  assert.equal(row.name, `mickey${row.age}`, 'inserts correct data');
  done();
});
