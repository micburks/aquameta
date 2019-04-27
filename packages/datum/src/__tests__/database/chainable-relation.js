import test from 'tape';
import {relation} from '../../database/chainable.js';

test('#relation - throws when no arguments provided', t => {
  t.throws(relation, Error);
  t.end();
});

test('#relation - parses schema and relation names from argument', t => {
  const rel = relation('endpoint.session');
  t.is(rel.schemaName, 'endpoint');
  t.is(rel.relationName, 'session');
  t.end();
});

test('#relation - adds `public` schema when no schema provided', t => {
  const rel = relation('widget');
  t.is(rel.schemaName, 'public');
  t.is(rel.relationName, 'widget');
  t.end();
});
