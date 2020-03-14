import ramda from 'ramda';
import chai from 'chai';
import {describe} from 'these-are-tests';
import {
  relation,
  where,
  whereSimilarTo,
  whereNull,
} from '../../database/chainable.js';

const {compose} = ramda;
const {expect} = chai;

const {it} = describe('chainable fn');

const rel = relation('widget.widget');

it('#where - #equals - adds proper where object to args', () => {
  const name = 'name';
  const op = '=';
  const value = 'my_widget';

  const query = where(name, value)(rel);

  expect.true(query.args.where instanceof Array);
  expect.is(typeof query.args.where[0], 'object');
  expect.deepEqual(query.args.where[0], {name, op, value});
});

it('#where - #equals - can be called with all arguments', () => {
  const name = 'name';
  const op = '=';
  const value = 'my_widget';

  const query = where(name, value, rel);

  expect.deepEqual(query.args.where[0], {name, op, value});
});

it('#where - #equals - adds to existing where array', () => {
  const name = 'html';
  const op = '=';
  const value = '<template></template>';

  const query = compose(where(name, value), where('name', 'my_widget'))(rel);

  expect.deepEqual(query.args.where, [
    {name: 'name', op: '=', value: 'my_widget'},
    {name, op, value},
  ]);
});

it('#where - #similarTo - adds proper where object to args', () => {
  const name = 'name';
  const op = 'similar to';
  const value = '%my_widget';

  const query = whereSimilarTo(name, value)(rel);

  expect.deepEqual(query.args.where[0], {name, op, value});
});

it('#where - #null - adds proper where object to args', () => {
  const name = 'name';
  const op = 'is';
  const value = null;

  const query = whereNull(name)(rel);

  expect.deepEqual(query.args.where[0], {name, op, value});
});
