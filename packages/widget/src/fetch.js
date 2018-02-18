import { widgetTable, inputTable, eventTable, langTable, viewTable } from './database'

const widgetIdentifierRegex = /(.*)\:(.*)/

async function getWidget (identifier) {
  let widget

  try {
    widget = await widgetTable.row('name', identifier)
  } catch (e) {
    throw new Error('widget fetch failed: widget not found')
  }

  return widget
}

async function getInputs (widgetId) {
  let inputs

  try {
    inputs = await widgetInputs.rows('widget_id', widgetId)
  } catch (e) {
    throw new Error('widget fetch failed: widget inputs not found')
  }

  return inputs
}

export async function fetchWidget (identifier) {
  const [ , bundleName, widgetName ] = widgetIdentifierRegex.exec(identifier)

  const widget = await getWidget(widgetName, bundleName)
  const widgetId = widget.get('id')
  const [ events, inputs, lang, views ] = await Promise.all([
    getEvents(widgetId),
    getInputs(widgetId),
    getLang(widgetId),
    getViews(widgetId)
  ])

  return {
    bundleName,
    widgetName,
    widget,
    events,
    inputs,
    lang,
    views
  }
}
