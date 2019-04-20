import test from 'ava';
import {client, database, query} from '../../index.js';

test('#query - throws with invalid client', async t => {
  await t.throwsAsync(
    () => {
      return query({}, {});
    },
    {instanceOf: TypeError, message: 'query: invalid client'},
  );
});

test('#query - throws with invalid query datum', async t => {
  await t.throwsAsync(
    () => {
      return query(client.connection(), {});
    },
    {instanceOf: TypeError, message: 'query: invalid executable'},
  );
});

test('#query - will not throw with sane input', async t => {
  const rel = database.relation('widget.widget');
  const exec = database.select(rel);
  try {
    await query(client.connection(), exec);
  } catch (e) {
    console.log(e);
  }

  t.pass();
});

test('#query - will execute db connection', async t => {
  const rel = database.relation('bundle.commit');
  const executeConnection = query(client.connection());

  const rows = await executeConnection(database.select(rel));
  const response = JSON.parse(rows.response).result;

  t.true(response instanceof Array);
});

test.skip('#query - will execute fetch', t => {});
