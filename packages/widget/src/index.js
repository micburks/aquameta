import { datum } from 'aquameta-datum'
import { fetchWidget } from './fetch'
import { parseTemplate } from './parser'
import { renderTemplate } from './renderer'
const uuid = require('uuid').v4

export async function mount (widgetIdentifier, container) {
  if (typeof selector === 'string') {
    selector = document.querySelector(selector)
  } else if (!(selector instanceof Node)) {
    throw new Error('widget mount error: container must be string or DOM Node')
  }

  const mark = document.createElement('div')
  mark.id = uuid.v4()
  selector.appendChild(mark)

  const widget = await fetchWidget(widgetIdentifier)
  const [ template, context ] = await Promise.all([
    parseTemplate(widget),
    buildContext(widget) // ?
  ])

  const renderedFragment = await renderTemplate(template, context)
  selector.replaceChild(renderedFragment, mark)
}
