import __fs from 'fs';
import __path from 'path';
import __util from 'util';
import __cp from 'child_process';
import * as __helpers from './helpers.js';
import {query, database as db, client} from 'aquameta-datum';

const pathJoin = __path.join;
const pathResolve = __path.resolve;
const pathDirname = __path.dirname;
const pathBasename = __path.basename;

const readDir = __util.promisify(__fs.readdir);
const readDirVerbose = __helpers.readDirVerbose;
const readFile = __util.promisify(__fs.readFile);
const writeFile = __util.promisify(__fs.writeFile);
const copyFile = __util.promisify(__fs.copyFile);

const exec = __util.promisify(__cp.exec);
const spawn = __util.promisify(__cp.spawn);
const execFile = __util.promisify(__cp.execFile);

const prompt = __helpers.prompt;

// cli args/options
const args = __helpers.args;
const options = __helpers.options;

const go = query(client.connection());

const typeMap = {
  'pg_catalog.uuid': 'String',
  'pg_catalog.text': 'String',
  'pg_catalog.int4': 'Integer',
  'pg_catalog.oid': '',
  'pg_catalog."varchar"': 'String',
  'pg_catalog.int2': 'Integer',
  'pg_catalog.bool': '',
  'pg_catalog.int8': '',
  'pg_catalog.name': '',
  'pg_catalog."char"': '',
  'pg_catalog._text': '',
  'pg_catalog._oid': '',
  'pg_catalog.pg_lsn': '',
  'pg_catalog._name': '',
  'pg_catalog.regproc': '',
  'pg_catalog.bytea': '',
  'pg_catalog.timestamptz': '',
  'pg_catalog.inet': '',
  'pg_catalog.xid': '',
  'pg_catalog.regtype': '',
  'pg_catalog.pg_node_tree': '',
  'pg_catalog.anyarray': '',
  'pg_catalog.float4': '',
  'pg_catalog.oidvector': '',
  'pg_catalog._float4': '',
  'pg_catalog.int2vector': '',
  'pg_catalog._char': '',
  'pg_catalog._aclitem': '',
  'pg_catalog.float8': '',
  'pg_catalog."interval"': '',
  'pg_catalog."timestamp"': '',
  'pg_catalog._regtype': '',
  'pg_catalog._int2': '',
  'pg_catalog.pg_dependencies': '',
  'pg_catalog.pg_ndistinct': '',
  'pg_catalog.abstime': '',
  'pg_catalog.json': '',
  'meta.role_id': 'RoleId',
  'meta.field_id': 'FieldId',
  'meta.function_id': 'FunctionId',
  'meta._field_id': 'FieldId',
  'meta.type_id': 'TypeId',
  'meta._column_id': 'ColumnId',
  'meta.relation_id': 'RelationId',
  'meta.foreign_data_wrapper_id': 'ForeignDataWrapperId',
  'meta.column_id': 'ColumnId',
  'meta.row_id': 'RowId',
  'meta.policy_id': 'PolicyId',
  'meta.foreign_server_id': 'ForeignServerId',
  'meta.schema_id': 'SchemaId',
  'meta.operator_id': 'OperatorId',
  'meta.trigger_id': 'TriggerId',
  'meta.constraint_id': 'ContraintId',
  'meta.extension_id': 'ExtensionId',
  'meta.connection_id': 'ConnectionId',
  'meta.table_privilege_id': 'TablePrivilegeId',
  'meta.sequence_id': 'SequenceId',
  'meta.foreign_key_id': 'ForeignKeyId',
  'meta.cast_id': 'CastId',
  'meta.siuda': 'Suida',
  'public.hstore': 'Hstore',
};

export default async function types({args, options}) {
  const rows = await go(db.select(db.relation('meta.column')));
  const set = new Set(
    rows.map(row => {
      return row.type_name;
    }),
  );
  console.log(set);
}
