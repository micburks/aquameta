// @flow

import ramda from 'ramda';
import {addArg, addNestedArrayArg, addOrder, addWhere} from './args.js';
import type {Fn, Relation} from '../types.js';

const {__} = ramda;

export function relation(name: string): Relation {
  if (!name) {
    throw new Error('relation: relation name must be specified');
  }

  let [schemaName, relationName] = name.split('.');
  if (!relationName) {
    relationName = schemaName;
    schemaName = 'public';
  }

  return {
    schemaName,
    relationName,
    qualified: `${schemaName}.${relationName}`,
    url: `relation/${schemaName}/${relationName}`,
    args: {},
  };
}

// TODO
export function fn(name: string, args: Array<string> | {[string]: mixed}): Fn {
  if (!name) {
    throw new Error('fn: function name must be specified');
  }

  let [schemaName, fnName] = name.split('.');
  if (!fnName) {
    fnName = schemaName;
    schemaName = 'public';
  }

  const fnArgs = {};
  if (Array.isArray(args)) {
    fnArgs.vals = args;
  } else if (typeof args === 'object') {
    fnArgs.kwargs = args;
  } else {
    throw new TypeError('fn: args must be Array<string> or Object');
  }

  return {
    schemaName,
    fnName,
    qualified: `${schemaName}.${fnName}`,
    url: `function/${schemaName}/${fnName}`,
    args: {args: [fnArgs]}, // This is an array in endpoint functions
  };
}

/**
 * Operations to perform on chainable (returned from relation)
 */
export const where = addWhere('=');
export const whereEquals = where;
export const whereNot = addWhere('<>');
export const whereNotEquals = whereNot;
export const whereGt = addWhere('>');
export const whereGte = addWhere('>=');
export const whereLt = addWhere('<');
export const whereLte = addWhere('<=');
export const whereIn = addWhere('in');
export const whereNotIn = addWhere('not in');
export const whereLike = addWhere('like');
export const whereNotLike = addWhere('not like');
export const whereSimilarTo = addWhere('similar to');
export const whereNotSimilarTo = addWhere('not similar to');
// $FlowFixMe
export const whereNull = addWhere('is', __, null);
// $FlowFixMe
export const whereNotNull = addWhere('is not', __, null);

export const order = addOrder;
export const orderBy = order;
export const orderByAsc = addOrder('asc');
export const orderByDesc = addOrder('desc');
// export const orderByRandom = addOrder('random()'); // TODO: not supported by endpoint.request

export const limit = addArg('limit');
export const offset = addArg('offset');
export const evented = addArg('evented');
export const metaData = addArg('metaData');

export const exclude = addNestedArrayArg('exclude');
export const excludeColumn = exclude;
export const include = addNestedArrayArg('include');
export const includeColumn = include;
