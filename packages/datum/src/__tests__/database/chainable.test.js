import ramda from 'ramda';
import chai from 'chai';
import {describe} from 'these-are-tests';
import {
  relation,
  order,
  orderByAsc,
  orderByDesc,
  limit,
  exclude,
} from '../../database/chainable.js';

const {compose} = ramda;
const {expect} = chai;

const {it} = describe('chainable fn');

const rel = relation('widget.widget');

it('#order - adds proper object to args', () => {
  const column = 'name';
  const direction = 'asc';

  const query = order(direction, column)(rel);

  expect.true(query.args.order instanceof Array);
  expect.is(query.args.order[0].column, column);
  expect.is(query.args.order[0].direction, direction);
});

it('#order - asc/desc add value', () => {
  const ascColumn = 'name';
  const descColumn = 'updated_at';

  const query = compose(orderByAsc(ascColumn), orderByDesc(descColumn))(rel);

  expect.true(query.args.order instanceof Array);
  expect.deepEqual(query.args.order, [
    {column: descColumn, direction: 'desc'},
    {column: ascColumn, direction: 'asc'},
  ]);
});

it('#exclude - adds array values', () => {
  const columns = ['id', 'name'];

  const query = compose(exclude(columns[1]), exclude(columns[0]))(rel);

  expect.true(query.args.exclude instanceof Array);
  expect.deepEqual(query.args.exclude, [columns]);
});

it('#limit - adds value to args', () => {
  const value = '5';

  const query = limit(value)(rel);

  expect.is(query.args.limit, value);
});

it('#limit - throws on invalid input', () => {
  const value = null;

  expect.throws(() => limit(value)(rel), TypeError);
});
