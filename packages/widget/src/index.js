import { datum } from 'aquameta-datum'
import { uuid } from './uuid'
import { fetchWidget } from './fetch'
import { parseTemplate } from './parser'
import { renderTemplate } from './renderer'

export {
  fetchWidget,
  parseTemplate,
  renderTemplate
}

/**
 * mount
 *
 * Mount widget to container
 *
 * @params {string} widgetIdentifier
 * @params {string|Node} container
 * @returns {Promise}
 */
export async function mount (widgetIdentifier, container = document) {
  if (typeof container === 'string') {
    container = document.querySelector(container)
  } else if (!(container instanceof Node)) {
    throw new Error('widget mount error: container must be string or DOM Node')
  }

  const mark = document.createElement('div')
  mark.id = uuid()
  container.appendChild(mark)

  try {
    const widget = await fetchWidget(widgetIdentifier)
    const [ template, context ] = await Promise.all([
      parseTemplate(widget),
      buildContext(widget) // ?
    ])

    const renderedFragment = await renderTemplate(template, context)
    container.replaceChild(renderedFragment, mark)
  } catch (e) {
    console.error('widget mount error')
    console.error(e)
  }
}
