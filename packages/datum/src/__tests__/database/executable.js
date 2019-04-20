// @flow

import test from 'ava';
import {database} from '../../index.js';

test('http is defined', t => {
  const mockRequest = {
    method: 'GET',
    url: '/endpoint/relation/test/table',
  };

  const executable = database.http(mockRequest);

  t.is(executable.method, 'GET');
  t.is(executable.url, '/endpoint/relation/test/table');
  t.deepEqual(executable.args, {});
  t.is(executable.data, undefined);
});
