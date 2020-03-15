#!/usr/bin/env node

import types from '../lib/index.js';
import {args, options} from '../lib/helpers.js';

(async () => {
  try {
    await types({args, options});
    console.log('Done.');
  } catch (e) {
    console.error(e);
  }
})();
