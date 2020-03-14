// @flow

import ramda from 'ramda';

const {always, cond, equals, T} = ramda;

export const DELETE = 'DELETE';
export const INSERT = 'INSERT';
export const SELECT = 'SELECT';
export const UPDATE = 'UPDATE';

export const HTTP = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const getMethodFromType: string => string = cond([
  [equals(DELETE), always(HTTP.DELETE)],
  [equals(INSERT), always(HTTP.PATCH)],
  [equals(SELECT), always(HTTP.GET)],
  [equals(UPDATE), always(HTTP.PATCH)],
  [
    T,
    type => {
      throw new TypeError(`unknown type: ${type}`);
    },
  ],
]);
