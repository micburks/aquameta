// @flow

import chai from 'chai';
import {describe} from 'these-are-tests';
import {database} from '../../index.js';

const {expect} = chai;

const {it} = describe('chainable fn');

it('#http - parses request', () => {
  const req = {
    method: 'POST',
    url: '/endpoint/v1/relation/test/table?name=value',
    body: {body: true},
  };

  const executable = database.http(req);

  expect.is(executable.method, 'POST');
  expect.is(executable.url, 'v1/relation/test/table');
  expect.deepEqual(executable.args, {name: 'value'});
  expect.deepEqual(executable.data, {body: true});
});

it('#http - parses source url into fn call', () => {
  const req = {
    url: '/db/widget/widget/Component.js',
  };

  const executable = database.http(req);

  const expectedArgs = [
    {
      vals: ['widget', 'widget', 'js', 'Component'],
    },
  ];

  expect.is(executable.method, 'GET');
  expect.is(executable.url, 'function/endpoint/source');
  expect.deepEqual(executable.args, {
    args: expectedArgs,
    source: true,
  });
  expect.is(executable.data, null);
});
