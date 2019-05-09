import { datum } from 'aquameta-datum'
import { uuid } from './uuid'
import { fetchWidget } from './fetch'
import { parseTemplate } from './parser'
import { renderTemplate, renderTemplateAsString } from './renderer'

export {
  fetchWidget,
  parseTemplate,
  renderTemplate
}

// TODO: install service worker

// TODO: provide serverRender function
export async function serverRender (widgetIdentifier, container = document) {
  const mark = document.createElement('div')
  mark.id = uuid()
  container.appendChild(mark)

  try {
    const renderFn = db.schema('widget').function('render', {})
    const { html, css, scripts, data } = await renderFn({ name: widgetIdentifier })

    // TODO: data should contain some representation of events and whatnot

    mark.outerHTML = html

    // TODO: attach event listeners

    const style = document.head.querySelector(`style[widget_name="${widgetIdentifier}"]`)
    if (!style) {
      document.head.appendChild(`<style widget_name="${widgetIdentifier}">${css}</style>`)
    }

    scripts.forEach(script => {
      // TODO: add scripts to body
    })
  } catch (e) {
    console.error('widget mount error')
    console.error(e)
  }
}

export async function render (widgetIdentifier) {
  const widget = await fetchWidget(widgetIdentifier)
  const [ template, context ] = await Promise.all([
    parseTemplate(widget),
    buildContext(widget) // ?
  ])

  let renderedFragment
  if (document) {
    renderedFragment = await renderTemplate(template, context)
  } else {
    renderedFragment = await renderTemplateAsString(template, context)
  }
  return renderedFragment
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
    const renderedFragment = await render(widgetIdentifier) 
    container.replaceChild(renderedFragment, mark)
  } catch (e) {
    console.error('widget mount error')
    console.error(e)
  }
}
