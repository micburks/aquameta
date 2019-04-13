// @flow

export type Client = {
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

type QueryError = any;
