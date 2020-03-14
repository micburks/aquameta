import chai from 'chai';
import {describe} from 'these-are-tests';
import {relation} from '../../database/chainable.js';

const {expect} = chai;

const {it} = describe('chainable fn');

it('#relation - throws when no arguments provided', () => {
  expect.throws(relation, Error);
});

it('#relation - parses schema and relation names from argument', () => {
  const rel = relation('endpoint.session');
  expect.is(rel.schemaName, 'endpoint');
  expect.is(rel.relationName, 'session');
});

it('#relation - adds `public` schema when no schema provided', () => {
  const rel = relation('widget');
  expect.is(rel.schemaName, 'public');
  expect.is(rel.relationName, 'widget');
});
