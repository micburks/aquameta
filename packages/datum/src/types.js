// @flow

export type Client = {
  type: {},
  url: string,
  version: string,
  sessionCookie: string,
  cacheRequestMilliseconds: number,
  sockets: boolean,
  connection?: ConnectionOptions,
};

export type ClientOptions = {
  url?: string,
  version?: string,
  sessionCookie?: string,
  cacheRequestMilliseconds?: number,
  sockets?: boolean,
  connection?: ConnectionOptions,
};

export type ConnectionOptions = {
  user?: string,
  password?: string,
  database?: string,
  host?: string,
  port?: number,
  max?: number,
  idleTimeoutMilliseconds?: number,
};

export type Executable = {
  method: string,
  url: string,
  args: {[string]: mixed | Array<mixed>},
  data: ?{[string]: mixed},
  version: ?string,
  type: {},
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

export type Relation = {
  schemaName: string,
  relationName: string,
  url: string,
  args: {[string]: mixed},
};

export type Fn = {
  schemaName: string,
  fnName: string,
  url: string,
  args: {[string]: mixed},
};

// TODO
export type HTTPRequest = {[any]: any};
