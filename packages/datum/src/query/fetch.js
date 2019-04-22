// @flow

import unfetch from 'unfetch';
import nodeFetch from 'node-fetch';

export const fetch = __NODE__ ? nodeFetch : unfetch;
