// @flow

import {fetch} from './fetch.js';
import type {Client, Executable, QueryResult, WhereOps} from '../types.js';

type Request = {
  method: string,
  credentials?: string,
  headers: {[string]: string},
  body?: string,
};

/**
 * Fetch query results client-side
 * @returns {Promise}
 */
export default async function executeEndpoint(
  client: Client,
  query: Executable,
): Promise<QueryResult> {
  const requestUrl = `/${client.url}/${client.version}/${query.url}`
    .replace(/\/+/g, '/') // remove duplicate slashes
    .replace(/\/$/, ''); // remove tail slash
  const queryString = getQueryString(query.args);
  const options: Request = {
    method: query.method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (query.data) {
    options.body = JSON.stringify(query.data);
  }

  try {
    console.log(`endpoint: trying to fetch ${requestUrl}`, options);
    const response = await fetch(
      queryString ? `${requestUrl}?${queryString}` : requestUrl,
      options,
    );

    // Let client deal with status codes
    return response.json();
  } catch (error) {
    // Log error in collapsed group
    console.groupCollapsed(query.method, error.statusCode, error.title);
    if ('message' in error) {
      console.error(error.message);
    }
    console.groupEnd();
    throw error.title;
  }
}

// Map the keys of the args object to an array of encoded url components
function getQueryString(args: {[string]: mixed}): string {
  return Object.keys(args)
    .sort()
    .map(argName => argName in methods && methods[argName](args[argName]))
    .filter(Boolean)
    .join('&')
    .replace(/&&/g, '&');
}

type WhereArg = {
  name: string,
  op: WhereOps,
  value: any,
};
type OrderArg = {
  column: string,
  direction?: string,
};
const methods = {
  where(arg: WhereArg | Array<WhereArg>): string {
    // where: [{ name: 'column_name', op: '=', value: 'value' }]
    return asArray(arg)
      .map(w => `where=${urlEncode(w)}`)
      .join('&');
  },
  order(arg: OrderArg | Array<OrderArg>): string {
    // order_by: [{ column: 'column_name', direction: 'asc|desc' }]
    // TODO: random()?
    const columnList = asArray(arg).map(col => {
      const {column, direction = 'asc'} = col;
      return direction !== 'asc' ? `-${column}` : `${column}`;
    });
    return `order_by=${encodeURIComponent(columnList.join(','))}`;
  },
  limit(arg: number): string | null {
    // limit: number
    const parsedNum = parseInt(arg);
    if (!isNaN(parsedNum)) {
      return `limit=${parsedNum}`;
    } else {
      return null;
    }
  },
  offset(arg: number): string | null {
    // offset: number
    const parsedNum = parseInt(arg);
    if (!isNaN(parsedNum)) {
      return `order=${parsedNum}`;
    } else {
      return null;
    }
  },
  evented(): string {
    return 'session_id';
  },
  metaData(arg: any): string {
    return `meta_data=${urlEncode(arg)}`;
  },
  args(arg: any): string {
    return `args=${urlEncode(arg)}`;
  },
  exclude(arg: any): string {
    return `exclude=${urlEncode(arg)}`;
  },
  include(arg: any): string {
    return `include=${urlEncode(arg)}`;
  },
};

function urlEncode(str: any): string {
  return encodeURIComponent(JSON.stringify(str));
}

function asArray(arg: any): any {
  return arg instanceof Array ? arg : [arg];
}
