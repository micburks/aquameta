/* globals module require */

const {resolve} = require('path');
const readTables = require('./readTables.js');

module.exports = {
  importDir,
  exportTable,
};

async function importDir(path) {
  return Promise.all(await readTables(resolve(path)));
}

function exportTable(table) {
  if (typeof table !== 'string') {
    throw new Error('table argument must be of type `string`');
  }

  const [, relation] = table.split('.');

  if (!relation) {
    throw new Error(
      'table argument must be schema-qualified, i.e. `schema.relation`',
    );
  }

  return Promise.resolve();
}
