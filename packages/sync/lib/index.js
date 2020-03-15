import {resolve} from 'path';
import readTables from './readTables.js';
import writeTable from './writeTables.js';

export async function importDir(dataDir) {
  return Promise.all(await readTables(resolve(dataDir)));
}

export async function exportTables(tables, dir) {
  const tableNames = tables.split(',');
  const dataDir = resolve(dir);
  return Promise.all(tableNames.map(table => writeTable(table, dataDir)));
}
