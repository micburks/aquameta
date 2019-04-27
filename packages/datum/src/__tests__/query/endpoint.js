import test from 'tape';
import endpoint from '../../query/endpoint.js';
import * as fetchExport from '../../query/fetch.js';
import sinon from 'sinon';

test('#endpoint', async t => {
  const fakeFetch = (url, options) => {
    t.is(url, '/db/v3/relation/endpoint/session');
    t.is(options.method, 'POST');
    t.is(options.body, void 0, 'body is not added with no data');
    t.true('credentials' in options, 'some form of credentials are used');
    return {
      json: sinon.fake(),
    };
  };
  sinon.stub(fetchExport, 'fetch').callsFake(fakeFetch);

  const client = {
    url: '/db/',
    version: 'v3',
  };
  const query = {
    url: '/relation//endpoint/session/',
    method: 'POST',
    args: {},
    data: null,
  };
  await endpoint(client, query);
  fetchExport.fetch.restore();
  t.end();
});

test('#endpoint - with data', async t => {
  const fakeFetch = (url, options) => {
    t.is(typeof options.body, 'string', 'body is a string');
    t.is(options.body, '{"key":"value"}', 'body is stringified');
    return {
      json: sinon.fake(),
    };
  };
  sinon.stub(fetchExport, 'fetch').callsFake(fakeFetch);

  const query = {
    url: '/relation//endpoint/session/',
    method: 'POST',
    args: {},
    data: {key: 'value'},
  };
  await endpoint({}, query);
  fetchExport.fetch.restore();
  t.end();
});

test('#endpoint - with args', async t => {
  const argsString = 'limit=5&order_by=name';
  const args = {
    order: [
      {
        column: 'name',
        direction: 'asc',
      },
    ],
    limit: 5,
  };
  const client = {
    url: '/db',
    version: 'v3',
  };
  const query = {
    url: 'relation/endpoint/session',
    args,
  };

  const fakeFetch = url => {
    t.is(
      url,
      `${client.url}/${client.version}/${query.url}?${argsString}`,
      'adds query string',
    );
    return {
      json: sinon.fake(),
    };
  };
  sinon.stub(fetchExport, 'fetch').callsFake(fakeFetch);

  await endpoint(client, query);
  fetchExport.fetch.restore();
  t.end();
});
