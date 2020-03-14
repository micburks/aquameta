// @flow

import ramda from 'ramda';
import type {Direction, Executable, WhereOps} from '../types';

const {cond, curry, T} = ramda;

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
  return [].concat(val1, val2);
}

// (fn, str, str, exec) => exec
const applyOrderArgs = curry<
  (any, Executable) => Executable,
  Direction,
  string,
  Executable,
  Executable,
>(
  (
    fn: (any, Executable) => Executable,
    direction: Direction,
    column: string,
    chainable: Executable,
  ): Executable => fn({column, direction}, chainable),
);

// (fn, str, str, exec) => exec
const applyWhereArgs = curry<
  (any, Executable) => Executable,
  WhereOps,
  string,
  any,
  Executable,
  Executable,
>(
  (
    fn: (any, Executable) => Executable,
    op: WhereOps,
    name: string,
    value: any,
    chainable: Executable,
  ): Executable => fn({name, op, value}, chainable),
);

// (fn, str, any, exec) => exec
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

    const argValue = functor(chainable.args[clause], val);

    if (typeof argValue === 'undefined' || argValue == null) {
      throw new TypeError('chainable: invalid argument value');
    }

    return {
      ...chainable,
      args: {
        ...chainable.args,
        [clause]: argValue,
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

// (a|[a], b|[b]) => [[a, b]]
function concatAsNestedArrays(
  val1: mixed | Array<mixed>,
  val2: mixed,
): Array<mixed> {
  // TODO: This is super hacky. endpoint.rows_select expects a nested array [['val']]
  // $FlowFixMe
  return [concat(asArray(val1 ? val1[0] : []), asArray(val2))];
}

// (str, any, chainable) => chainable
export const addArg = setProp(valIdentity);
export const addArrayArg = setProp(concatAsArrays);
export const addNestedArrayArg = setProp(concatAsNestedArrays);

// (str, str, chainable) => chainable
export const addOrder = applyOrderArgs(addArrayArg('order'));

// (str, str, any, chainable) => chainable
export const addWhere = applyWhereArgs(addArrayArg('where'));
