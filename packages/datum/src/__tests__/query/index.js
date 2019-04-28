import test from 'tape';
import {client, database, query} from '../../index.js';

test('#query - throws with invalid client', async t => {
  await query({}, {}).catch(e => {
    t.true(e instanceof TypeError);
    t.true(/query: invalid client/.test(e.toString()));
  });
  t.end();
});

test('#query - throws with invalid datum', async t => {
  await query(client.connection(), {}).catch(e => {
    t.true(e instanceof TypeError);
    t.true(/query: invalid executable/.test(e.toString()));
  });
  t.end();
});

test('#query - will not throw with sane input', async t => {
  const rel = database.relation('widget.widget');
  const exec = database.select(rel);
  try {
    await query(client.connection(), exec);
  } catch (e) {
    t.fail();
  }
  t.pass();
  t.end();
});

test('#query - will execute db connection', async t => {
  const rel = database.relation('bundle.commit');
  const executeConnection = query(client.connection());

  const rows = await executeConnection(database.select(rel));

  t.true(rows instanceof Array);
  t.end();
});

test.skip('#query - will execute fetch', t => {
  t.end();
});
