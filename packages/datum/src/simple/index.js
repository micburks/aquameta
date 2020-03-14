import query from '../query/index.js';
import * as client from '../client.js';
import * as db from '../database/index.js';
import {compose} from 'ramda';

const c = __NODE__ ? client.connection() : client.endpoint();
const go = query(c);
const select = compose(go, db.select);
const insert = compose(go, db.insert);
const del = compose(go, db.del);

// TODO: should query be able to run multiple queries in a single transaction?
// TODO: you'd want to be able to do order/limit/include/exlude from these functions too

const metaSchema = db.relation('meta.schema');
const metaTable = db.relation('meta.table');
const metaColumn = db.relation('meta.column');

export async function createTable(table, columns) {
  if (await tableExists(table)) {
    return;
  }

  const rel = db.relation(table);

  await ensureSchema(rel);
  await ensureTable(rel);
  await ensureColumns(rel, columns);
}

export async function dropTable(table) {
  const rel = db.relation(table);
  try {
    await deleteRows(table);
    await deleteRows(metaColumn.qualified, {
      schema_name: rel.schemaName,
      relation_name: rel.relationName,
    });
    await deleteRows(metaTable.qualified, {
      schema_name: rel.schemaName,
      name: rel.relationName,
    });
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}

export function getRows(table) {
  return select(db.relation(table));
}

export function insertRows(table, rows) {
  return insert(db.relation(table), rows);
}

export async function updateRows(
  table: string,
  fields: {[string]: any},
  equalities?: {[string]: any},
) {
  if (equalities) {
    const wheres = Object.entries(equalities).map(([key, value]) => {
      return db.where(key, value);
    });
    await compose(go, ...wheres)(db.update(db.relation(table), fields));
  } else {
    return db.update(db.relation(table), fields);
  }
}

export async function deleteRows(table: string, equalities?: {[string]: any}) {
  if (equalities) {
    const wheres = Object.entries(equalities).map(([key, value]) => {
      return db.where(key, value);
    });
    await compose(del, ...wheres)(db.relation(table));
  } else {
    return del(db.relation(table));
  }
}

export async function tableExists(table) {
  const rel = db.relation(table);
  const rows = await compose(
    select,
    db.where('schema_name', rel.schemaName),
    db.where('name', rel.relationName),
  )(metaTable);
  return rows.length === 1;
}

async function ensureSchema(rel) {
  const schemaRows = db.select(metaSchema);
  const rows = await go(db.where('name', rel.schemaName, schemaRows));
  if (rows.length === 0) {
    return insert(metaSchema, {name: rel.schemaName});
  }
}

async function ensureTable(rel) {
  const exec = compose(
    select,
    db.where('name', rel.relationName),
    db.where('schema_name', rel.schemaName),
  );
  const rows = await exec(metaTable);
  if (rows.length === 0) {
    return insert(metaTable, {
      name: rel.relationName,
      schema_name: rel.schemaName,
    });
  }
}

async function ensureColumns(rel, columns) {
  const exec = compose(
    select,
    db.include('type_name'),
    db.include('name'),
    db.where('relation_name', rel.relationName),
    db.where('schema_name', rel.schemaName),
  );
  const rows = await exec(metaColumn);
  const columnArray = Object.entries(columns).map(([name, type_name]) => ({
    schema_name: rel.schemaName,
    relation_name: rel.relationName,
    name,
    type_name,
  }));
  if (!rows || !columnsMatch(rows, columnArray)) {
    // TODO: so many ways to do a full migration
    return insert(metaColumn, columnArray);
  }
}

function columnsMatch(columns = [], targetColumns = []) {
  // TODO:
  // So many possibilities here
  // May need a map of pg types to user types
  /*
  const rowMap = rows.reduce(
    (m, {name, type_name}) => m.set(name, type_name),
    new Map(),
  );
  return cols.every(
    ({name, type_name}) => rowMap.has(name) && rowMap.get(name) === type_name,
  );
  */
  const colNames = columns.map(({name}) => name);
  return targetColumns.every(({name}) => colNames.includes(name));
}
