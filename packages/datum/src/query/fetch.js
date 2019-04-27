// @flow

import unfetch from 'unfetch';
import nodeFetch from 'node-fetch';

// $FlowFixMe
export const fetch = __NODE__ ? nodeFetch : unfetch;
