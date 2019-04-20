import test from 'ava';
import {
  connection,
  endpoint,
  isConnectionClient,
  isEndpointClient,
  isInvalidClient,
} from '../client.js';

const defaultUrl = 'endpoint';
const defaultVersion = 'v1';

test('#client - endpoint', t => {
  const c = endpoint();

  t.true(isEndpointClient(c));
  t.false(isConnectionClient(c));
  t.true(!isInvalidClient(c));
});

test('#client - merges configs', t => {
  const option = 'my-option';
  const c = endpoint({option});

  t.is(c.url, defaultUrl);
  t.is(c.version, defaultVersion);
  t.is(c.option, option);
});

test('#client - connection', t => {
  const c = connection();

  t.true(isConnectionClient(c));
  t.false(isEndpointClient(c));
  t.true(!isInvalidClient(c));
});

test('#client - isInvalidClient', t => {
  t.true(isInvalidClient({}));
  t.true(isInvalidClient({type: new Object()}));
  t.true(isInvalidClient({connection: true}));
  t.true(isInvalidClient({endpoint: true}));
});
