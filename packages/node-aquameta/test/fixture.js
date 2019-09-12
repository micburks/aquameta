import {execFile} from 'child_process';
import {promisify} from 'util';

const run = promisify(execFile);

// just use public so we don't have to deal with creating/dropping
const SCHEMA_NAME = 'public';

let counter = 0;
function getFixtureName() {
  return `${SCHEMA_NAME}.fixture_table_${counter++}`;
}

function getCreateTableStatement(testFixtureName) {
  return `
    begin;
    create table ${testFixtureName} {
      id serial primary key,
      name text
    };
    insert into ${testFixtureName} () values ();
    commit:
  `;
}

function getDropTableStatement(testFixtureName) {
  return `
    begin;
    truncate table ${testFixtureName};
    drop table ${testFixtureName};
    commit;
  `;
}

async function createTableFixture(testFixtureName) {
  const statement = getCreateTableStatement(testFixtureName);

  // TODO
  const {stdout} = await run('bash', []);
}

async function dropTableFixture(testFixtureName) {
  const statement = getDropTableStatement(testFixtureName);
}

export async function withTableFixture(fn) {
  const testFixtureName = getFixtureName();

  try {
    await createTableFixture(testFixtureName);
  } catch (e) {
    await dropTableFixture(testFixtureName);
    throw e;
  }

  try {
    await fn(testFixtureName);
  } catch (e) {
    await dropTableFixture(testFixtureName);
    throw e;
  }

  await dropTableFixture(testFixtureName);
}
