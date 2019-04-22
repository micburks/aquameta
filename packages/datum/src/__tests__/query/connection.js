import test from 'tape';
import connection from '../../query/connection.js';
import sinon from 'sinon';
import pg from 'pg';

test('#connection', async t => {
  const fakeRow = {name: 'fake-name'};
  let loggedIn = false;

  const fakeQuery = queryString => {
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

  const client = {sessionId: '123', connection: {host: 'override-host'}};
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

test('#connection - without sessionId', async t => {
  const fakeRow = {name: 'fake-name'};

  const fakeQuery = queryString => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      t.fail('tried to login');
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
    t.is(config.user, 'anonymous', "doesn't alter user");

    return clientAPI;
  });

  const result = await connection({}, {});
  t.is(result, fakeRow, 'returns data');
  t.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
  t.end();
});

test('#connection - uses anonymous if login fails', async t => {
  const fakeRow = {name: 'fake-name'};

  const fakeQuery = queryString => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      return {rows: null};
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
    t.is(config.user, 'anonymous', "doesn't alter user");

    return clientAPI;
  });

  const client = {sessionId: '123'};
  const result = await connection(client, {});
  t.is(result, fakeRow, 'still returns data');
  t.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
  t.end();
});

test.skip('#connection - deals with error in running queries', async t => {
  const fakeQuery = () => {
    throw new Error('db connection failed');
  };
  const clientAPI = {
    query: sinon.fake(fakeQuery),
    connect: sinon.fake(),
    end: sinon.fake(),
  };
  sinon.stub(pg, 'Client').callsFake(() => clientAPI);

  const client = {sessionId: '123'};
  const result = await connection(client, {});
  t.is(result, null, 'returns null');
  t.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
  t.end();
});

test('#connection - passes all query params', async t => {
  const sessionId = '123';
  const version = 'v2';
  const query = {
    method: 'POST',
    url: '/widget/dependency',
    args: {limit: 5},
    data: {id: '999'},
  };

  const fakeQuery = (queryString, args) => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      t.deepEqual(args, [sessionId]);
      return {rows: [{role_name: 'logged-in-user'}]};
    } else {
      t.deepEqual(args, [
        version,
        query.method,
        query.url,
        JSON.stringify(query.args),
        JSON.stringify(query.data),
      ]);
      return {rows: [{}]};
    }
  };
  const clientAPI = {
    query: sinon.fake(fakeQuery),
    connect: sinon.fake(),
    end: sinon.fake(),
  };
  sinon.stub(pg, 'Client').callsFake(() => clientAPI);

  const client = {sessionId, version};
  await connection(client, query);
  pg.Client.restore();
  t.end();
});
