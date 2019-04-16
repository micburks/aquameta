// @flow

import chai from 'chai';
import {describe} from './utils.js';
import {database} from '../index.js';

const {assert} = chai;
const test = describe('executable http');

test.it('http is defined', async () => {
  // const server
  assert.equal(database.http, {});
});
