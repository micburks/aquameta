import { compose } from 'ramda'
import { client, database: db, query } from 'aquameta-datum'

const executeQuery = query(client({ endpoint: true }))
const widgetRel = db.relation('widget.widget')

/* Widget creator function */
const createWidget = compose(
  executeQuery,
  db.insert(widgetRel)
)

createWidget({
  name: 'new_widget'
})
  .then(newRow)
  .catch(error)

/* Compose query */
const newRowWidgets = compose(
  db.limit(10),
  db.orderBy('created_at'),
  db.whereLike('name', '%new_row')
)(widgetRel)

executeQuery(
  db.select(newRowWidgets)
)
  .then(rows)
  .catch(error)

/* Operate on composed query */
const newWidget = compose(
  db.where('name', 'new_widget')
)(widgetRel)

executeQuery(
  db.delete(newWidget)
)
  .then(deletedRow)
  .catch(error)

