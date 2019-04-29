import * as simple from '../../simple/index.js';
import test from 'tape';
// import sinon from 'sinon';

test('simple', async t => {
  await simple.createTable('foo.bar', {
    id: 'text',
    name: 'text',
  });
  t.ok(await simple.tableExists('foo.bar'), 'creates table');

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
  t.is(rows.length, 2, 'inserts rows');

  rows = await simple.deleteRows('foo.bar');
  t.is(rows.length, 0, 'deletes rows');

  await simple.dropTable('foo.bar');
  t.notOk(await simple.tableExists('foo.bar'), 'drops table');

  t.end();
});
