// @flow

import test from 'tape';
import {database} from '../../index.js';

test('#http - parses request', t => {
  const req = {
    method: 'POST',
    url: '/endpoint/v1/relation/test/table?name=value',
    body: {body: true},
  };

  const executable = database.http(req);

  t.is(executable.method, 'POST');
  t.is(executable.url, 'v1/relation/test/table');
  t.deepEqual(executable.args, {name: 'value'});
  t.deepEqual(executable.data, {body: true});
  t.end();
});

test('#http - parses source url into fn call', t => {
  const req = {
    url: '/db/widget/widget/Component.js',
  };

  const executable = database.http(req);

  const expectedArgs = [
    {
      vals: ['widget', 'widget', 'js', 'Component'],
    },
  ];

  t.is(executable.method, 'GET');
  t.is(executable.url, 'function/endpoint/source');
  t.deepEqual(executable.args, {
    args: expectedArgs,
    source: true,
  });
  t.is(executable.data, null);
  t.end();
});
