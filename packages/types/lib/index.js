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

const go = query(client.connection());

const blacklistSchema = [
  'pg_catalog',
  'information_schema',
];

export default async function types({args, options}) {
  const rows = await go(db.select(db.relation('widget.type')));

  const defs = rows.filter(({schema_name}) => !blacklistSchema.includes(schema_name))
    .map(({schema_name, relation_name, columns, nullable}) => {
    const tableRowType = kebabToPascal(`${schema_name}_${relation_name}`);
    return `\tdeclare type ${tableRowType} = Array<{|
${Object.entries(columns).map(([col, type]) =>
`\t\t${normalizeColumnName(col)}: ${nullable[col] ? '?' : ''}${typeMap[type] || 'String'}`).join(',\n')};
\t|}>;
\tdeclare export function select('${schema_name}.${relation_name}'): Promise<${tableRowType}>;`;
  }).join('\n');

  // fallback
  // fn.push(`(string => Array<any>)`);
  await writeFile(args[0], fileContents(defs));

  /*
  const fn = [];
  const defs = rows.map(({schema_name, relation_name, columns, nullable}) => {
    const tableRowType = kebabToPascal(`${schema_name}_${relation_name}`);
    fn.push(`('${schema_name}.${relation_name}' => Promise<${tableRowType}>)`);
    return `declare type ${tableRowType} = Array<{|
${Object.entries(columns).map(([col, type]) =>
`  ${normalizeColumnName(col)}: ${nullable[col] ? '?' : ''}${typeMap[type] || 'String'}`
).join(',\n')}
|}>;`;
  }).join('\n');

  // fallback
  fn.push(`(string => Array<any>)`);
  const fnSignature = `${fn.join('\n\t& ')}\n;`;
  await writeFile(args[0], fileContents(`${fnSignature}\n${defs}`));
  */
}

const fileContents = str =>
`// @flow
declare module "aquameta-datum" {
${str}
};`;
/*
const fileContents = str =>
`// @flow
declare module "aquameta-datum" {
  declare export var select: ${str}
};`;
*/

function normalizeColumnName(str) {
  return str.toLowerCase().replace(/ /g, '_');
}

function kebabToPascal(str) {
  return str.replace(/^./, first => first.toUpperCase())
    .replace(/_./g, chars => chars[1].toUpperCase());
}

const typeMap = {
  'pg_catalog.uuid': 'String',
  'pg_catalog.text': 'String',
  'pg_catalog.int4': 'Integer',
  'pg_catalog.oid': 'String',
  'pg_catalog."varchar"': 'String',
  'pg_catalog.int2': 'Integer',
  'pg_catalog.bool': 'Boolean',
  'pg_catalog.int8': 'Integer',
  'pg_catalog.name': 'String',
  'pg_catalog."char"': 'String',
  'pg_catalog._text': 'String',
  'pg_catalog._oid': 'String',
  'pg_catalog.pg_lsn': 'String',
  'pg_catalog._name': 'String',
  'pg_catalog.regproc': 'String',
  'pg_catalog.bytea': 'String',
  'pg_catalog.timestamptz': 'String',
  'pg_catalog.inet': 'String',
  'pg_catalog.xid': 'String',
  'pg_catalog.regtype': 'String',
  'pg_catalog.pg_node_tree': 'String',
  'pg_catalog.anyarray': 'String',
  'pg_catalog.float4': 'String',
  'pg_catalog.oidvector': 'String',
  'pg_catalog._float4': 'String',
  'pg_catalog.int2vector': 'String',
  'pg_catalog._char': 'String',
  'pg_catalog._aclitem': 'String',
  'pg_catalog.float8': 'String',
  'pg_catalog."interval"': 'String',
  'pg_catalog."timestamp"': 'String',
  'pg_catalog._regtype': 'String',
  'pg_catalog._int2': 'Integer',
  'pg_catalog.pg_dependencies': 'String',
  'pg_catalog.pg_ndistinct': 'String',
  'pg_catalog.abstime': 'String',
  'pg_catalog.json': 'any',
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
  'public.hstore': 'any',
};
