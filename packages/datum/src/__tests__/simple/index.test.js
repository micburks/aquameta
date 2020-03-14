import {describe} from 'these-are-tests';
import assert from 'assert';
import * as simple from '../../simple/index.js';
import postgres from 'postgres';

const {it} = describe('simple');

it('tableExists', async () => {
  assert.ok(
    !(await simple.tableExists('test.foo')),
    'tableExists returns false',
  );

  await withTempTable(
    {tableName: 'test.foo', schema: 'id integer'},
    async () => {
      assert.ok(
        await simple.tableExists('test.foo'),
        'tableExists return true',
      );
    },
  );
});

async function withTempTable({tableName, schema}, callback) {
  const sql = postgres({database: 'aquameta'});
  await sql`create table ${tableName} (${schema}};`;
  let error;
  try {
    await callback(sql);
  } catch (e) {
    error = e;
  }
  await sql`drop table ${tableName};`;
  await sql.end();
  if (error) {
    throw error;
  }
}

it('createTable', async () => {
  await simple.createTable('foo.bar', {
    id: 'text',
    name: 'text',
  });
  assert.ok(await simple.tableExists('foo.bar'), 'creates table');

  let rows = await simple.insertRows('foo.bar', [
    {
      id: '0',
      name: 'first',
    },
    {
      id: '1',
      name: 'second',
    },
  ]);
  assert.equal(rows.length, 2, 'inserts rows');

  rows = await simple.deleteRows('foo.bar');
  assert.equal(rows.length, 0, 'deletes rows');

  await simple.dropTable('foo.bar');
  assert.ok(!(await simple.tableExists('foo.bar')), 'drops table');
});
