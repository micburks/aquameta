#!/usr/bin/env node

import {promises as __fs} from 'fs';
import __path from 'path';
import * as __helpers from './helpers.js';

import {query, client, database} from 'aquameta-datum';
import {parse, astToRows} from '../src/index.js';

const pathResolve = __path.resolve;
const pathJoin = __path.join;
const pathBasename = __path.basename;
const pathExt = __path.extname;

const readDir = __fs.readdir;
const readFile = __fs.readFile;

// cli args/options
const args = __helpers.args;
const options = __helpers.options;

const [dir] = args;
if (!dir) {
  console.error('Must supply directory to read');
  process.exit(1);
}

const execute = query(client.connection());

(async () => {
  const resolvedDir = pathResolve(dir);
  const files = await readDir(resolvedDir);
  for (const file of files) {
    const resolvedFile = pathJoin(resolvedDir, file);
    const contents = await readFile(resolvedFile, 'utf-8');
    const parsed = await parse(contents);
    const rows = await astToRows(file.replace(pathExt(file), ''), parsed);
    if (!options.dry) {
      await execute(database.fn('template.insertSorted', rows));
    }
  }
})();
