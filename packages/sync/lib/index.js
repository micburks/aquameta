/* globals module require */

const {resolve} = require('path');
const readTables = require('./readTables.js');
const writeTable = require('./writeTables.js');

module.exports = {
  importDir,
  exportTables,
};

async function importDir(path) {
  return Promise.all(await readTables(resolve(path)));
}

async function exportTables(tables, dir) {
  tables = tables.split(',');
  dir = resolve(dir);

  return Promise.all(tables.map(table => writeTable(table, resolve(dir))));
}
