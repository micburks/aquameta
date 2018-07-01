import { client, database: db, util, query } from 'aquameta-datum'

const executeQuery = query(client({ endpoint: true }))
const widgetRel = db.relation('widget.widget')

/* Widget creator function */
const createWidget = util.compose(
  executeQuery,
  db.insert(widgetRel)
)

createWidget({
  name: 'new_widget'
})
  .then(handleNewRow)
  .catch(logError)

/* Compose query */
const latestProductFilter = util.compose(
  db.limit(10),
  db.orderBy('created_at'),
  db.whereLike('name', '%_product')
)

const latestProductWidgets = latestProductFilter(widgetRel)
 
executeQuery(
  db.select(latestProductWidgets)
)
  .then(handleRows)
  .catch(logError)

/* Operate on composed query */
const newWidgetFilter = util.compose(
  db.where('name', 'new_widget')
)

const newWidget = newWidgetFilter(widgetRel)

executeQuery(
  db.delete(newWidget)
)
  .then(handleDeletedRow)
  .catch(logError)

