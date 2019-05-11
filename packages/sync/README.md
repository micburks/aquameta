
# aquameta-sync

Import a directory into a table. Export a table into files.

Modern tools are built around using files to edit data. This can be an issue
when bootstrapping an Aquameta database that doesn't contain the necessary UI
to edit certain fields properly.

This is a utility for working outside of the database that enables syncing
files with database fields.


### Format

Rows will be written/read in the following format:

```
 - data (directory name of your choosing)
   |-- endpoint.resource (table - named using schema-qualified table name)
       |-- 0 (row - named using 'id' field)
           |-- path (field - named using the column name)
           |-- content
       |-- 1
           |-- path
           |-- content
  |-- widget.component (table)
      |-- a80abaa5-ac49-4b35-bae9-944e1cc49efe
          |-- name
          |-- js
      |-- d658f9bd-f0fd-48c1-8412-b91bcfb1954c
          |-- name
          |-- js
```

The "field" files contain the contents of that database field.

You may notice that there are no `id` files. These are not necessary because
the name of the row directory is the `id` of the row.


### Config

Configure how to sync a table by adding a `config.js` to the table directory
(e.g. `data/endpoint.resource`).

```js
// config.js
module.exports = {
  truncate: true, // Override the `truncate` option
};
```

The entire default config would look like the below:

```
module.exports = {
  truncate: false,
  insertId: false,
  upsert: true, // false will only try to insert
  updateKey: 'id',
};
```

#### `truncate`

Type: `boolean`
Default: `false`

`truncate: true` will delete all rows from the table before importing


#### `insertId`

Type: `boolean`
Default: `false`

`insertId: true` will insert the name of the row folder as the `id` field when
importing

`insertId: false` will ignore the `id` field when importing


#### `upsert`

Type: `boolean`
Default: `false`

`upsert: true` will use the `updateKey` config option to determine whether each
row should be inserted (if the row is not found) or updated (if the row exists
in the table). This allows you to work around constraints on the table, such as
a unique field.

`upsert: false` will only insert the rows. This will fail if a constraint is
present (such is usually the case with an `id` field).


#### `updateKey`

Type: `string`
Default: `id`

When `upsert: true`, `updateKey: 'name'` will use the value of the `name` field
to determine if a row should be updated or inserted
