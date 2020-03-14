import {describe} from 'these-are-tests';
import chai from 'chai';
import {
  connection,
  endpoint,
  isConnectionClient,
  isEndpointClient,
  isInvalidClient,
} from '../client.js';

const {expect} = chai;

const defaultUrl = 'endpoint';
const defaultVersion = 'v1';

const {it} = describe('client');

it('#client - endpoint', () => {
  const c = endpoint();

  expect.true(isEndpointClient(c));
  expect.false(isConnectionClient(c));
  expect.true(!isInvalidClient(c));
});

it('#client - merges configs', () => {
  const option = 'my-option';
  const c = endpoint({option});

  expect.is(c.url, defaultUrl);
  expect.is(c.version, defaultVersion);
  expect.is(c.option, option);
});

it('#client - connection', () => {
  const c = connection();

  expect.true(isConnectionClient(c));
  expect.false(isEndpointClient(c));
  expect.true(!isInvalidClient(c));
});

it('#client - isInvalidClient', () => {
  expect.true(isInvalidClient({}));
  expect.true(isInvalidClient({type: new Object()}));
  expect.true(isInvalidClient({type: Symbol('executable')}));
  expect.true(!isInvalidClient({type: Symbol.for('executable')}));
  expect.true(isInvalidClient({connection: true}));
  expect.true(isInvalidClient({endpoint: true}));
});
