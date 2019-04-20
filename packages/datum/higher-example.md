# datum wrapper

## imports

Make want to make sure these interop. Rows from one work with the other.

```js
// Simple API
import meta from 'aquameta-datum';

// Low-level API
import {client, database, query} from 'aquameta-datum';
```

## clients

Get API from creating a client

```js
import client from 'aquameta';
const meta = client.endpoint()
```

## create schema

Helpers to create schema - think migrations

Creates if they don't exists. Could have `meta.existence` view on server that
helps bundle these queries?

```js
meta.createSchema('widget.component')
meta.createTable('widget.component')
meta.createColumns('widget.component', [{name: 'name', type: 'text'}])
```
or

```js
const table = meta.table('widget.component')
await meta.create(table, [{name, type}]);
```

## get rows

```js
const table = meta.table('widget.component')
const rows = await meta.getRows(table)

// or

const rows = await table.rows()
```

## meta rows

```js
// get meta rows?
await meta.metaTableRow(rel)
await meta.metaSchemaRow(rel)
await meta.metaColumnsRows(rel)

// or should this be on row object?

await row.getMetaTableRow()
```

## where/order/include

The reason we don't do things this way in low-level aquameta-datum is that
filters and such cannot be applied after-the-fact. The must be used at the time
of the call.

```js
const table = meta.table('widget.component')
const filters = meta.filters([
  meta.where('name', name),
  meta.order('updated_at'),
  meta.limit(5)
]);

const rows = await meta.getRows(table, filters) // Typed, functional
// or
const rows = await table.rows(filters) // Classes
```

## foreign key

```js
// setup
const rel = meta.table('widget.widget');
const rows = await meta.getRows(rel);
const ids = rows.map(row => row.id);
const otherRel = meta.table('widget.dependency');

meta.getRelatedRows(otherRel, [meta.whereIn('id', ids)]) // do it yourself
// or
await meta.getRelatedRows(rows, 'id:widget_id', otherRel, [filters]) // map columns
// or
await rows.getRelatedRows(otherRel, 'id:widget_id', [filters]) // Classes
```

## insert/update/delete

```js
```


## get semantics

```js
```

## execute row methods

```js
```
