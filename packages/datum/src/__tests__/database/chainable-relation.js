import test from 'ava';
import {fn, relation} from '../../database/chainable.js';

test('#relation - throws when no arguments provided', t => {
  t.throws(relation, Error);
});

test('#relation - parses schema and relation names from argument', t => {
  const rel = relation('endpoint.session');
  t.is(rel.schemaName, 'endpoint');
  t.is(rel.relationName, 'session');
});

test('#relation - adds `public` schema when no schema provided', t => {
  const rel = relation('widget');
  t.is(rel.schemaName, 'public');
  t.is(rel.relationName, 'widget');
});

test('#fn - throws when no arguments provided', t => {
  t.throws(fn, Error);
});

test('#fn - parses schema and relation names from argument', t => {
  const func = fn('widget.transpile', {});
  t.is(func.schemaName, 'widget');
  t.is(func.fnName, 'transpile');
});

test('#fn - adds `public` schema when no schema provided', t => {
  const func = fn('uuid_generate_v4', {});
  t.is(func.schemaName, 'public');
  t.is(func.fnName, 'uuid_generate_v4');
});

test('#fn - handles val arrays', t => {
  const args = [1, 2, 3];
  const func = fn('endpoint.create_session', args);
  t.deepEqual(func.args.args.vals, args);
});

test('#fn - handles kwargs object', t => {
  const args = {name: 'my_name', new_session: true};
  const func = fn('endpoint.create_session', args);
  t.deepEqual(func.args.args.kwargs, args);
});
