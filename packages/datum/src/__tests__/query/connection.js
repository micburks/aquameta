import test from 'tape';
import connection from '../../query/connection.js';
import sinon from 'sinon';
import pg from 'pg';

test('#connection', async t => {
  const fakeRow = {name: 'fake-name'};
  let loggedIn = false;

  const fakeQuery = (queryString, args) => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      loggedIn = true;
      return {rows: [{role_name: 'logged-in-user'}]};
    } else {
      return {rows: [fakeRow]};
    }
  };
  const clientAPI = {
    query: sinon.fake(fakeQuery),
    connect: sinon.fake(),
    end: sinon.fake(),
  };

  sinon.stub(pg, 'Client').callsFake(config => {
    if (loggedIn) {
      t.is(
        config.user,
        'logged-in-user',
        'updates config to use logged in user',
      );
    } else {
      t.is(config.user, 'anonymous', 'uses default config');
    }
    t.is(config.host, 'override-host', 'merges given client config');

    return clientAPI;
  });

  const client = {host: 'override-host', sessionId: '123'};
  const result = await connection(client, {});
  t.is(result, fakeRow, 'returns data');
  t.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
  t.end();
});
