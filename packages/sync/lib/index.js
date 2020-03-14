import {resolve} from 'path';
import readTables from './readTables.js';
import writeTable from './writeTables.js';

export async function importDir(path) {
  return Promise.all(await readTables(resolve(path)));
}

export async function exportTables(tables, dir) {
  tables = tables.split(',');
  dir = resolve(dir);
  return Promise.all(tables.map(table => writeTable(table, resolve(dir))));
}
