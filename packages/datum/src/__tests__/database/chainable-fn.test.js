import chai from 'chai';
import {describe} from 'these-are-tests';
import {fn} from '../../database/chainable.js';

const {expect} = chai;

const {it} = describe('chainable fn');

it('#fn - throws when no arguments provided', () => {
  expect.throws(fn, Error);
});

it('#fn - parses schema and relation names from argument', () => {
  const func = fn('widget.transpile', {});
  expect.is(func.schemaName, 'widget');
  expect.is(func.fnName, 'transpile');
});

it('#fn - adds `public` schema when no schema provided', () => {
  const func = fn('uuid_generate_v4', {});
  expect.is(func.schemaName, 'public');
  expect.is(func.fnName, 'uuid_generate_v4');
});

it('#fn - handles val arrays', () => {
  const args = [1, 2, 3];
  const func = fn('endpoint.create_session', args);
  expect.deepEqual(func.args.args, [{vals: args}]);
});

it('#fn - handles kwargs object', () => {
  const args = {name: 'my_name', new_session: true};
  const func = fn('endpoint.create_session', args);
  expect.deepEqual(func.args.args, [{kwargs: args}]);
});
