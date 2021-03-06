import {existsSync, promises as fs} from 'fs';
import {join} from 'path';
import {promisify} from 'util';
import {client, database as db, query} from 'aquameta-datum';

const executeQuery = query(client.connection());

const defaultConfig = {
  truncate: false,
  insertId: false,
  upsert: true, // false will only try to insert
  updateKey: 'id',
};

async function upsert(rel, rows, config) {
  const pk = config.updateKey;
  const go = query(client.connection());
  const dbRows = await go(db.select(db.include(pk, rel)));

  const pkValues = new Set(dbRows.map(({[pk]: val}) => val));

  const updatePromises = [];
  const insertableRows = [];

  rows.forEach(row => {
    const pkValue = row[pk];

    if (!config.insertId) {
      delete row.id;
    }

    if (pkValues.has(pkValue)) {
      // delete row[pk];
      // update is broken so can't delete this field since it
      // may have a non-null constraint
      const filteredRel = db.where(pk, pkValue, rel);
      updatePromises.push(go(db.update(filteredRel, row)));
    } else {
      insertableRows.push(row);
    }
  });

  if (insertableRows.length) {
    updatePromises.push(go(db.insert(rel, insertableRows)));
  }

  return Promise.all(updatePromises);
}

export default async function readTables(path) {
  const tables = (await fs.readdir(path)).map(async table => {
    const tablePath = join(path, table);
    const configPath = join(tablePath, 'config.js');

    let config = {
      ...defaultConfig,
    };

    if (existsSync(configPath)) {
      const configFile = await import(configPath).then(({default: c}) => c);
      config = {
        ...config,
        ...configFile,
      };
    }

    const rel = db.relation(table);

    if (config.truncate) {
      await executeQuery(db.del(rel));
    }

    const rows = await Promise.all(await readRows(tablePath));

    if (!rows || !rows.length) {
      return {
        table,
        rows: [],
      };
    }

    if (config.upsert) {
      await upsert(rel, rows, config);
    } else {
      await executeQuery(
        db.insert(
          rel,
          rows.map(row => {
            if (!config.insertId) {
              delete row.id;
            }

            return row;
          }),
        ),
      );
    }

    return {
      table,
      rows,
    };
  });

  return tables;
}

async function readRows(path) {
  const rows = (await fs.readdir(path))
    .filter(p => p !== 'config.js')
    .filter(p => !p.startsWith('.'))
    .map(async rowId => {
      const rowPath = join(path, rowId);
      const columns = await readColumns(rowPath);

      return {
        id: rowId,
        ...columns,
      };
    });

  return Promise.all(rows);
}

async function readColumns(path) {
  const row = {};

  const columns = (await fs.readdir(path))
    .filter(p => !p.startsWith('.'))
    .map(async name => {
      const fullPath = join(path, name);
      let content = await fs.readFile(fullPath, 'utf-8');

      if (content.charAt(content.length - 1) === '\n') {
        // Remove new line at end of file
        content = content.slice(0, -1);
      }

      row[name] = content;
    });

  await Promise.all(columns);
  return row;
}
