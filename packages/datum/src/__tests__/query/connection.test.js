import {describe} from 'these-are-tests';
import chai from 'chai';
import connection from '../../query/connection.js';
import sinon from 'sinon';
import pg from '@micburks/pg';

const {expect} = chai;

const {it} = describe('connection');

it('#connection', async () => {
  const fakeRow = {name: 'fake-name'};
  let loggedIn = false;

  const fakeQuery = queryString => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      loggedIn = true;
      return {
        rows: [
          {
            response: JSON.stringify({
              result: [{row: {role_name: 'logged-in-user'}}],
            }),
          },
        ],
      };
    } else {
      return {
        rows: [{response: JSON.stringify({result: [{row: fakeRow}]})}],
      };
    }
  };
  const clientAPI = {
    query: sinon.fake(fakeQuery),
    connect: sinon.fake(),
  };
  sinon.stub(pg, 'Client').callsFake(config => {
    if (loggedIn) {
      expect.is(
        config.user,
        'logged-in-user',
        'updates config to use logged in user',
      );
    } else {
      expect.is(config.user, 'anonymous', 'uses default config');
    }
    expect.is(config.host, 'override-host', 'merges given client config');

    return clientAPI;
  });

  const client = {
    sessionId: '123',
    connection: {host: 'override-host'},
  };
  const user = await connection(client, {});
  expect.deepEquals(user[0], fakeRow, 'returns data');
  expect.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
});

it('#connection - without sessionId', async () => {
  const fakeRow = {name: 'fake-name'};

  const fakeQuery = queryString => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      expect.fail('tried to login');
    } else {
      return {
        rows: [
          {
            response: JSON.stringify({
              result: [{row: fakeRow}],
            }),
          },
        ],
      };
    }
  };
  const clientAPI = {
    query: sinon.fake(fakeQuery),
    connect: sinon.fake(),
    end: sinon.fake(),
  };
  sinon.stub(pg, 'Client').callsFake(config => {
    expect.is(config.user, 'anonymous', "doesn't alter user");

    return clientAPI;
  });

  const result = await connection({}, {});
  expect.deepEqual(result[0], fakeRow, 'returns data');
  expect.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
});

it('#connection - uses anonymous if login fails', async () => {
  const fakeRow = {name: 'fake-name'};

  const fakeQuery = queryString => {
    if (/^select .* role_name from endpoint.session/.test(queryString)) {
      return {
        rows: [
          {
            response: JSON.stringify({
              result: [],
            }),
          },
        ],
      };
    } else {
      return {
        rows: [
          {
            response: JSON.stringify({
              result: [{row: fakeRow}],
            }),
          },
        ],
      };
    }
  };
  const clientAPI = {
    query: sinon.fake(fakeQuery),
    connect: sinon.fake(),
    end: sinon.fake(),
  };
  sinon.stub(pg, 'Client').callsFake(config => {
    expect.is(config.user, 'anonymous', "doesn't alter user");

    return clientAPI;
  });

  const client = {rawSession: true, sessionId: '123'};
  const result = await connection(client, {});
  expect.deepEqual(result[0], fakeRow, 'still returns data');
  expect.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
});

it('#connection - deals with error in running queries', async () => {
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
  expect.is(result, null, 'returns null');
  expect.is(
    clientAPI.connect.callCount,
    clientAPI.end.callCount,
    'all clients are released',
  );

  pg.Client.restore();
});

it('#connection - passes all query params', async () => {
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
      expect.deepEqual(args, [sessionId]);
      return {rows: [{role_name: 'logged-in-user'}]};
    } else {
      expect.deepEqual(args, [
        version,
        query.method,
        query.url,
        JSON.stringify(query.args),
        JSON.stringify(query.data),
      ]);
      return {
        rows: [
          {
            response: JSON.stringify({
              result: [],
            }),
          },
        ],
      };
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
});
