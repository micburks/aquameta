import endpoint from '../../query/endpoint.js';
import chai from 'chai';
import * as fetchExport from '../../query/fetch.js';
import {describe} from 'these-are-tests';
import sinon from 'sinon';

const {expect} = chai;

const {xit} = describe('endpoint');

xit('#endpoint', async () => {
  const fakeFetch = (url, options) => {
    expect.is(url, '/db/v3/relation/endpoint/session');
    expect.is(options.method, 'POST');
    expect.is(options.body, void 0, 'body is not added with no data');
    expect.true('credentials' in options, 'some form of credentials are used');
    return {
      json: sinon.fake.returns(
        Promise.resolve({
          result: [{row: {}}],
        }),
      ),
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
});

xit('#endpoint - with data', async () => {
  const fakeFetch = (url, options) => {
    expect.is(typeof options.body, 'string', 'body is a string');
    expect.is(options.body, '{"key":"value"}', 'body is stringified');
    return {
      json: sinon.fake.returns(
        Promise.resolve({
          result: [{row: {}}],
        }),
      ),
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
});

xit('#endpoint - with args', async () => {
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
    expect.is(
      url,
      `${client.url}/${client.version}/${query.url}?${argsString}`,
      'adds query string',
    );
    return {
      json: sinon.fake.returns(
        Promise.resolve({
          result: [{row: {}}],
        }),
      ),
    };
  };
  sinon.stub(fetchExport, 'fetch').callsFake(fakeFetch);

  await endpoint(client, query);
  fetchExport.fetch.restore();
});
