
# aquameta-datum

Service layer for the Aquameta database API


## Getting started

`aquameta-datum` provides a functional API for fetching data from an Aquameta
database. The API is intentionally split into small, composable parts to allow
partially applying queries. This lends itself to a UI built with modular,
reusable components, such as the widget framework
([aquameta-widget](https://github.com/micburks/aquameta/tree/master/packages/widget)).

### Create a query executor

```javascript
import { client, query } from 'aquameta-datum'

// `query` is a curried function that takes the `client` and the operation to perform
// For now, we'll just give it the context of the `client` so we can perform a query later
const exeucteQuery = query(
  client.endpoint() // `endpoint` here refers to fetching from a remote data source
)

// ...and then later...
await executeQuery(/* operation */)
```

#### Note about performing queries from widgets

When using the widget framework, unless strictly necessary, it is highly
recommended to use the `executeQuery` function exported by `aquameta-widget`.
This function does the same thing as creating a query executor by hand, but it
abstracts away the client from your widget. This both simplifies your data
fetching code and allows your application to be rendered server-side when
possible.


### Execute an operation

```javascript
import { client, database, query } from 'aquameta-datum'

// As before...
const executeQuery = query(
  client.endpoint()
)

// Create the database operation to perform
const operation = database.select(
  database.relation('endpoint.session')
)

// And finally, perform the query!
const sessionRows = await executeQuery(operation)
```

You may have noticed that the string passed to `database.relation` has two
names separated by a `.`. This is what is called a *schema-qualified* table
name. Aquameta makes heavy usage of separating modules into schemas, e.g.
putting the `session` table in the `endpoint` schema. All tables in the
`endpoint` schema provide functionality contributing to the `endpoint` module.
We consider it best practice to put all application data into a single schema
with a unique name for that application.

What we have now is a very simple way to fetch data from the database, but so
far this operation doesn't seem reusable. Let's do something about that. What
if we want a reusable function `selectRows` that takes a relation and gets
all the rows.

```javascript
import { client, database, util, query } from 'aquameta-datum'

// As before...
const executeQuery = query(
  client.endpoint()
)

// Pull in a functional utility called `compose`
const selectRows = util.compose(
  executeQuery,
  database.select
)

/**
 * `selectRows` now contains a function chain that passes return values
 * recursively through the given functions. You can think of `util.compose` as a
 * shorthand for the following:
 * 
 * const selectRows = (...args) => {
 *   return executeQuery(
 *     database.select(...args)
 *   )
 * }
 */

// `selectRows` can now be passed around without rewriting the underlying query

const sessionRows = await selectRows(
  database.relation('endpoint.session')
)

const resourceRows = await selectRows(
  database.relation('endpoint.resource')
)
```


### Adding clauses

In real life, we'll want to control our query a bit more.

```javascript
// Add to the function composition by sorting the table by the `created_at` column
// and limiting the query to the first 10 rows
const selectTenLatest = util.compose(
  executeQuery,
  database.select,
  database.limit(10),
  database.orderBy('created_at')
)

const latestSessionRows = await selectTenLatest(
  database.relation('endpoint.session')
)
```

`aquameta-datum` provides a suite of clauses to create complex queries. If you
notice your queries getting long and copied throughout your application, you
should consider writing a view in the database. This will simplify your
client-side code and potentially give you a boost in query performance.

We created a complex query, but we sacrificed some reusability in our code.  In
the next section, let's look at why we may want to separate or operation from
the filter.


### CRUDing

As a first principle, Aquameta believes in datafication of the programming
stack. Data has 4 basic operations, collectively known as CRUD (create, read, update, delete).
What this means to you is that everything in an Aquameta database can be
created, read, updated, and deleted through a common API. In addition to the
`database.select` function we've seen so far, `aquameta-datum` provides
`database.insert`, `database.update`, and `database.del`.

```javascript
const selectRows = util.compose(
  executeQuery,
  database.select
)

const updateRows = util.compose(
  executeQuery,
  database.update
)

const deleteRows = util.compose(
  executeQuery,
  database.del
)

const tenLatestFilter = util.compose(
  database.limit(10),
  database.orderBy('created_at')
)

const sessionRel = database.relation('endpoint.session')

// Select filtered rows
const sessionRows = await selectRows(
  tenLatestFilter(sessionRel)
)

// Update `updated_at` column of rows matching filter
const updatedSessionRows = await updateRows(
  tenLatestFilter(sessionRel),
  { 'updated_at': new Date() }
)

// Delete rows matching filter
const deletedSessionRows = await deleteRows(
  tenLatestFilter(sessionRel)
)

/**
 * We could have also composed a new function with the query executor
 * and the filter
 *
 * const selectTenLatest = util.compose(
 *   selectRelation,
 *   tenLatestFilter
 * )
 */
```

If that doesn't excite you, how about this?

```javascript
const widgetRel = database.relation('widget.widget')

/* Widget creator function */
const createWidget = util.compose(
  executeQuery,
  database.insert(widgetRel)
)

try {
  const newWidgetRow = await createWidget({
    name: 'my_new_widget'
  })

  handleNewRow(newWidgetRow)
} catch (e) {
  logError(e)
}
```

What we did in this second example is create a resuable, context-aware insert
function. Not too bad.


## API Reference

**Prerequisite: Familiarize yourself with `compose` and `curry` functional programming techniques.**

`aquameta-datum` has a functional API that can be quite a mental load when starting out. This API take all the relevant database concepts and splits them into independent parts. This creates an incredibly flexible approach to writing queries. Mastery of the library requires an understanding of how to orchestrate the 5 distinct parts:

- a query - something that runs it all
- a client - where to run the query (connection, endpoint)
- an operation - what to do (select, update, insert, delete)
- an entity - what to perform this on (table, function)
- optional filters - what to resulting data looks like (where, limit, order, include)

### query

The `query` function is the actual executor of all elements of a query (i.e. client and executable).

```js
query(
  client: Client<Endpoint|Connection>,
  executable: Executable,
): Promise<QueryResult, QueryError>
```


### client

Clients can be created with one of 2 client creator functions available on the `client` object.

##### client.endpoint

```js
client.endpoint(
  config: ClientOptions
): Client<Endpoint>
```


##### client.connection

```js
client.connection(
  config: ClientOptions
): Client<Connection>
```


### database

Operations, entities, and filters are representative of elements of a SQL query. These are all grouped together on the `database` object.

#### database - operations

Operations take an `Entity` and return an `Executable` to run. These map directly to CRUD operations in the database.

##### database.select

```js
database.select(
  entity: Entity<Relation|Fn>
): Executable
```

Perform `SELECT` on a relation or a function.


##### database.insert

```js
database.insert(
  entity: Entity<Relation>
): Executable
```

Perform `INSERT` on a relation.


##### database.update

```js
database.update(
  entity: Entity<Relation>
): Executable
```

Perform `UPDATE` on a relation.


##### database.del

```js
database.del(
  entity: Entity<Relation>
): Executable
```

Perform `DELETE` on a relation.


#### database - other executable creators

Special cases to create an `Executable` from an intermediate contruct.

##### database.http

```js
database.http(
  request: HTTPRequest
): Executable
```

`database.http` is unlike the rest of the `database` properties. This is a server-side only method that parses an HTTP query made from an `aquameta-datum` client. The result of this function is an `Executable`, therefore it doesn't need to be passed to an operation function. The anatomy of the HTTP request contains all the necessary information to make a query.

```js
// Example route in a `koa` server
app.use(async (ctx, next) => {
  if (ctx.req.url.startsWith('/api')) {
    const result = await query(
      client.connection(),
      db.http(ctx.req);
    )
    ctx.res.body = JSON.stringify(result);
  }
  return next();
});
```


#### database - entities

Create an entity (i.e. database object).

The entire datum API is curried. This lets you supply some arguments now and
save the partially-applied function for later.

```js
// Works
db.orderBy('name', db.relation('meta.roles'))

// Also works
db.orderBy('name')(db.relation('meta.role'))
```

Entities will always be the last argument to filter functions.


##### database.relation

```js
database.relation(
  schemaQualifiedName: string
): Entity<Relation>
```

A relation can be a table or a view in the database. `schemaQualifiedName`, as implied, must be a schema-qualified relation name with a `.` separating the schema name and relation name (e.g. `public.my_table`).

**Note that inserting, updating, or deleting from a view must be supported in the database with `instead of` triggers.**


##### database.fn

```js
database.fn(
  schemaQualifiedName: string,
  params: Params|Array<any>),
): Entity<Fn>
```

Execute a function in the database. Again, `schemaQualifiedName` must be a schema-qualified function name (e.g. `public.uuid_generate_v4`).

TODO: Functions are very difficult to get right. When fleshing out the implementation of this method, give detailed instructions for how to use from the client. This is a difficult function to run even if you know what you're doing.


#### database - filters

Apply a filter to an entity.

TODO: Add the rest of the filters.

##### database.where

```js
database.where<T: Relation|Fn>(
  column: string,
  value: any,
  entity: Entity<T>,
): Entity<T>
```


##### database.limit

```js
database.limit<T: Relation|Fn>(
  value: number,
  entity: Entity<T>,
): Entity<T>
```


##### database.order

```js
database.order<T: Relation|Fn>(
  direction: "asc"|"desc",
  column: string,
  entity: Entity<T>,
): Entity<T>
```
