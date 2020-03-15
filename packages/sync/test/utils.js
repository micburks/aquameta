import ramda from 'ramda';
import {client, database as db, query} from 'aquameta-datum';

const {compose} = ramda;

const executeQuery = (...args) => {
  return query(client.connection())(...args);
};

const metaSchemaRel = db.relation('meta.schema');
const metaTableRel = db.relation('meta.table');
const metaColumnRel = db.relation('meta.column');
const testUserRel = db.relation('test.user');
const testUserMetaRow = compose(
  db.where('schema_name', 'test'),
  db.where('name', 'user'),
)(metaTableRel);
const testMetaRow = compose(db.where('name', 'test'))(metaSchemaRel);

async function executeEach(...args) {
  const previous = [];
  for (const q of args) {
    await Promise.all(previous);
    previous.push(executeQuery(q));
  }
}

export async function createTestTable() {
  await executeEach(
    db.insert(metaSchemaRel, {
      name: 'test',
    }),
    db.insert(metaTableRel, {
      schema_name: 'test',
      name: 'user',
    }),
    db.insert(metaColumnRel, [
      {
        schema_name: 'test',
        relation_name: 'user',
        name: 'name',
        type_name: 'text',
      },
      {
        schema_name: 'test',
        relation_name: 'user',
        name: 'age',
        type_name: 'text',
      },
      {
        schema_name: 'test',
        relation_name: 'user',
        name: 'id',
        type_name: 'text',
      },
    ]),
  );
}

export async function dropTestTable() {
  await executeEach(
    db.del(testUserRel),
    db.del(testUserMetaRow),
    db.del(testMetaRow),
  );
}

export function getTestRows() {
  return executeQuery(db.select(testUserRel));
}
