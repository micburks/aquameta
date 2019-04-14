// @noflow

import {client, database as db, util, query} from 'aquameta-datum';

const executeQuery = query(
  client.endpoint() /* client */
);
const widgetRel = db.relation('widget.widget');

/* Widget creator function */
const createWidget = util.compose(
  executeQuery,
  db.insert(widgetRel), /* partial executable */
);

createWidget({
  name: 'new_widget' /* full executable */
})
  .then(handleNewRow)
  .catch(logError);

/* Compose query */
const latestProductFilter = util.compose(
  db.limit(10),
  db.orderBy('created_at'),
  db.whereLike('name', '%_product'),
); /* filter */

const latestProductWidgets = latestProductFilter(widgetRel);
 
executeQuery(
  db.select(latestProductWidgets)
)
  .then(handleRows)
  .catch(logError);

/* Operate on composed query */
const newWidgetFilter = util.compose(
  db.where('name', 'new_widget')
);

const newWidget = newWidgetFilter(widgetRel);

executeQuery(
  db.delete(newWidget)
)
.then(handleDeletedRow)
.catch(logError);


/* If you want to reuse a query on a different host, create the executable separate from the connection. */

/* node - remote or local queries */
const selectSuperusers = compose(
  db.select,
  db.where('superuser', true),
)(db.relation('meta.role'));

const localRows = await query(
  client.connection(),
  selectSuperusers,
);

const remoteRows = await query(
  client.endpoint({ host: 'registry.aquameta.com' }),
  selectSuperusers,
);

/* browser - remote or local queries */
const publicTables = compose(
  db.select,
  db.where('schema_name', 'public'),
)(db.relation('meta.table'));

const localRows = await query(
  client.endpoint(),
  selectSuperusers,
);

const remoteRows = await query(
  client.endpoint({ host: 'registry.aquameta.com' }),
  selectSuperusers,
);


/* node - parse query from http */
app.use(async (ctx, next) => {
  if (ctx.req.url.startsWith('/api')) {
    const executable = db.http(ctx.req);
    let rows;
    if (process.env.PGDATA) {
      rows = await query(
        client.connection(),
        executable,
      )
    } else {
      rows = await query(
        client.endpoint({ host: 'hub.aquameta.com' }),
        executable,
      )
    }
    ctx.res.body = JSON.stringify(rows);
  }
  return next();
});


/* functions */
query(
  client.connection(),
  db.fn('bundle.checkout', {commit_id: commitId})
);