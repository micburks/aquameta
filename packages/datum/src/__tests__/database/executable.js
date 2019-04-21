// @flow

import test from 'tape';
import {database} from '../../index.js';

test('#http - parses request', t => {
  const req = {
    method: 'POST',
    url: '/endpoint/relation/test/table?name=value',
    body: {body: true},
  };

  const executable = database.http(req);

  t.is(executable.method, 'POST');
  t.is(executable.url, '/endpoint/relation/test/table');
  t.deepEqual(executable.args, {name: 'value'});
  t.deepEqual(executable.data, {body: true});
  t.end();
});

test('#http - parses source url', t => {
  const req = {
    url: '/db/widget/widget/Component.js',
  };

  const executable = database.http(req);

  t.is(executable.method, 'GET');
  t.is(executable.url, 'relation/widget/widget');
  t.deepEqual(executable.args, {
    source: true,
    include: ['js'],
    where: [{name: 'name', op: '=', value: 'Component'}],
  });
  t.is(executable.data, null);
  t.end();
});
