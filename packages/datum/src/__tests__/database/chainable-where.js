import {compose} from 'ramda';
import test from 'tape';
import {
  relation,
  where,
  whereSimilarTo,
  whereNull,
} from '../../database/chainable.js';

const rel = relation('widget.widget');

test('#where - #equals - adds proper where object to args', t => {
  const name = 'name';
  const op = '=';
  const value = 'my_widget';

  const query = where(name, value)(rel);

  t.true(query.args.where instanceof Array);
  t.is(typeof query.args.where[0], 'object');
  t.deepEqual(query.args.where[0], {name, op, value});
  t.end();
});

test('#where - #equals - can be called with all arguments', t => {
  const name = 'name';
  const op = '=';
  const value = 'my_widget';

  const query = where(name, value, rel);

  t.deepEqual(query.args.where[0], {name, op, value});
  t.end();
});

test('#where - #equals - adds to existing where array', t => {
  const name = 'html';
  const op = '=';
  const value = '<template></template>';

  const query = compose(where(name, value), where('name', 'my_widget'))(rel);

  t.deepEqual(query.args.where, [
    {name: 'name', op: '=', value: 'my_widget'},
    {name, op, value},
  ]);
  t.end();
});

test('#where - #similarTo - adds proper where object to args', t => {
  const name = 'name';
  const op = 'similar to';
  const value = '%my_widget';

  const query = whereSimilarTo(name, value)(rel);

  t.deepEqual(query.args.where[0], {name, op, value});
  t.end();
});

test('#where - #null - adds proper where object to args', t => {
  const name = 'name';
  const op = 'is';
  const value = null;

  const query = whereNull(name)(rel);

  t.deepEqual(query.args.where[0], {name, op, value});
  t.end();
});
