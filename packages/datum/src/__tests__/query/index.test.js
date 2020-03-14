import {describe} from 'these-are-tests';
import {client, database, query} from '../../index.js';
import assert from 'assert';

const {it, xit} = describe;

it('#query - throws with invalid client', async () => {
  await query({}, {}).catch(e => {
    assert(e instanceof TypeError);
    assert(/query: invalid client/.test(e.toString()));
  });
});

it('#query - throws with invalid datum', async () => {
  await query(client.connection(), {}).catch(e => {
    assert(e instanceof TypeError);
    assert(/query: invalid executable/.test(e.toString()));
  });
});

it('#query - will not throw with sane input', async () => {
  const rel = database.relation('widget.widget');
  const exec = database.select(rel);
  try {
    await query(client.connection(), exec);
  } catch (e) {
    assert.fail();
  }
});

it('#query - will execute db connection', async () => {
  const rel = database.relation('bundle.commit');
  const executeConnection = query(client.connection());

  const rows = await executeConnection(database.select(rel));

  assert(rows instanceof Array);
});

xit('#query - will execute fetch', () => {});
