/* globals module require */

const fs = require('fs');
const del = require('del');
const {join} = require('path');
const {compose} = require('ramda');
const {promisify} = require('util');
const {client, database: db, query} = require('aquameta-datum');

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

module.exports = writeTable;

const select = compose(
  query(client.connection()),
  db.select,
);

async function writeTable(table, dir) {
  const tablePath = join(dir, table);
  const rows = await select(db.relation(table));
  const rowPromises = [];
  rows.map(async row => {
    if (!row.id) {
      row.id = `${randomId()}.no-id`;
    }
    // clean table dir execpt for config.js file
    await del([join(tablePath, '*'), `!${join(tablePath, 'config.js')}`]);
    const rowPath = join(tablePath, row.id);
    await mkdir(rowPath, {recursive: true});
    const fieldPromises = [];
    Object.entries(row).map(([column, value]) => {
      if (column !== 'id') {
        const fieldPath = join(rowPath, column);
        if (value) {
          // exclude null values
          fieldPromises.push(writeFile(fieldPath, value, 'utf-8'));
        }
      }
    });
    rowPromises.push(Promise.all(fieldPromises));
  });
  await Promise.all(rowPromises);
  return {table, dir: tablePath};
}

const idSet = new Set();
function randomId() {
  let id;
  do {
    id = Math.random()
      .toString(36)
      .substring(7);
  } while (idSet.has(id));
  return id;
}
