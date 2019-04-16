// @flow

import {cond, curry, T} from 'ramda';
import type {Direction, Executable, WhereOps} from '../types';

// (a) => bool
const isFalsy: (?mixed) => boolean = val => !val;

// (a) => bool
const isArray: (?mixed) => boolean = arr => arr instanceof Array;

// (a|[a]) => [a]
const asArray: (mixed | Array<mixed>) => Array<mixed> = cond([
  [isFalsy, () => []],
  [isArray, (i: any): Array<mixed> => i],
  [T, (val: mixed) => [val]],
]);

// ([a], [b]) => [a, b]
function concat(val1: Array<mixed>, val2: Array<mixed>): Array<mixed> {
  return [...val1, ...val2];
}

// (fn, str, str) => any
const applyOrderArgs = curry<(any) => any, Direction, string, void>(
  (fn: any => any, direction: Direction, column: string): void =>
    fn({column, direction}),
);

// TODO: in these two functions, we could check that no extra arguments were passed in and throw a helpful message otherwise.

// (fn, str, str, any) => any
const applyWhereArgs = curry<(any) => any, WhereOps, string, any, void>(
  (fn: any => any, op: WhereOps, name: string, value: any): void =>
    fn({name, op, value}),
);

// (fn, str, any, chainable) => chainable
const setProp = curry<(mixed, mixed) => mixed, string, any, Executable, any>(
  (
    functor: (mixed, mixed) => mixed,
    clause: string,
    val: any,
    chainable: Executable,
  ) => {
    if (!(chainable && chainable.args)) {
      throw new TypeError('chainable: invalid chainable');
    }

    return {
      ...chainable,
      args: {
        ...chainable.args,
        [clause]: functor(chainable.args[clause], val),
      },
    };
  },
);

// (a, b) => b
function valIdentity(previous: any, val: any): any {
  return val;
}

// (a|[a], b|[b]) => [a, b]
function concatAsArrays(val1: mixed | Array<mixed>, val2: mixed): Array<mixed> {
  return concat(asArray(val1), asArray(val2));
}

// (str, any, chainable) => chainable
export const addArg = setProp(valIdentity);
export const addArrayArg = setProp(concatAsArrays);

// (str, str, chainable) => chainable
export const addOrder = applyOrderArgs(addArrayArg('order'));

// (str, str, any, chainable) => chainable
export const addWhere = applyWhereArgs(addArrayArg('where'));
