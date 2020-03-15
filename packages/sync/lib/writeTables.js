import {promises as fs} from 'fs';
import del from 'del';
import {join} from 'path';
import ramda from 'ramda';
import {promisify} from 'util';
import {client, database as db, query} from 'aquameta-datum';

const {compose} = ramda;

const select = compose(query(client.connection()), db.select);

export default async function writeTable(table, dir) {
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

    await fs.mkdir(rowPath, {
      recursive: true,
    });

    const fieldPromises = [];

    Object.entries(row).map(([column, value]) => {
      if (column !== 'id') {
        const fieldPath = join(rowPath, column);

        if (value) {
          // exclude null values
          fieldPromises.push(fs.writeFile(fieldPath, value, 'utf-8'));
        }
      }
    });

    rowPromises.push(Promise.all(fieldPromises));
  });

  await Promise.all(rowPromises);

  return {
    table,
    dir: tablePath,
  };
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
