// @flow

export type Client = {
  type: {},
  connection?: boolean,
  endpoint?: boolean,
  url: string,
  version: string,
  sessionCookie: string,
  cacheRequestMilliseconds: number,
  sockets: boolean,
};

export type Executable = {
  method: string,
  url: string,
  args: {},
  data: {},
};

export type QueryResult =
  | {
      rows: Array<{[string]: any}>,
    }
  | QueryError;

export type QueryError = any;

export type Direction = 'asc' | 'desc' | 'random()';

/*
export type OrderArgs = {
  column: string,
  direction: Direction,
};
*/

export type WhereOps =
  | '='
  | '<>'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'like'
  | 'not like'
  | 'similar to'
  | 'not similar to'
  | 'is'
  | 'is not';

/*
export type WhereArgs = {
  name: string,
  op: WherOps,
  value: any,
};
*/
