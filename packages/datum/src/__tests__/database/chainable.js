import {compose} from 'ramda';
import test from 'ava';
import {
  relation,
  order,
  orderByAsc,
  orderByDesc,
  orderByRandom,
  limit,
  exclude,
} from '../../database/chainable.js';

const rel = relation('widget.widget');

test('#order - adds proper object to args', t => {
  const column = 'name';
  const direction = 'asc';

  const query = order(direction, column)(rel);

  t.true(query.args.order instanceof Array);
  t.is(query.args.order[0].column, column);
  t.is(query.args.order[0].direction, direction);
});

test('#order - asc/desc add value', t => {
  const ascColumn = 'name';
  const descColumn = 'updated_at';
  const randomColumn = 'some_column';

  const query = compose(
    orderByAsc(ascColumn),
    orderByDesc(descColumn),
    orderByRandom(randomColumn),
  )(rel);

  t.true(query.args.order instanceof Array);
  t.deepEqual(query.args.order, [
    {column: randomColumn, direction: 'random()'},
    {column: descColumn, direction: 'desc'},
    {column: ascColumn, direction: 'asc'},
  ]);
});

test('#exclude - adds array values', t => {
  const columns = ['id', 'name'];

  const query = compose(
    exclude(columns[1]),
    exclude(columns[0]),
  )(rel);

  t.true(query.args.exclude instanceof Array);
  t.deepEqual(query.args.exclude, columns);
});

test('#limit - adds value to args', t => {
  const value = '5';

  const query = limit(value)(rel);

  t.is(query.args.limit, value);
});

test('#limit - throws on invalid input', t => {
  const value = null;

  t.throws(() => limit(value)(rel), TypeError);
});
