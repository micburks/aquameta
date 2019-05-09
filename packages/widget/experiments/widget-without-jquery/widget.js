import element from './element'
import renderTemplate from './renderTemplate'
import scope from 'scope-css'
import { database } from 'aquameta-datum'
import { select } from './database'
import { NAME_ATTRIBUTE, STYLE_ATTRIBUTE } from './constants'


function widgetByName (name) {
  return select(
    database.where('name', name)(
      database.relation('widget.render')
    )
  )
}

async function render ({ name, html, css, events, inputs }) {
  // Add css to head if not found
  const styleSelector = `style[${STYLE_ATTRIBUTE}="${name}"]`
  if (!document.head.querySelector(styleSelector)) {
    document.head.appendChild(
      element('style', {
        rel: 'stylesheet',
        type: 'text/css',
        [STYLE_ATTRIBUTE]: name
      },
        scope(css, `[${NAME_ATTRIBUTE}="${name}"]`)
      )
    )
  }

  // Import all events
  const handlers = await Promise.all(
    events.map(async name => ({
      name,
      fn: await import(`/db/widget/event/${name}.js`)
    }))
  )

  // Replace all root tags
  const tags = Array.from(
    document.getElementsByTagName(name)
  )

  for (let tag of tags) {
    // Create input map for rendering
    const inputMap = inputs.reduce((acc, input) => {
      const { name, required } = input
      const provided = name in tag.attributes
      const hasDefault = 'default' in input

      if (!provided && !hasDefault && required) {
        throw new Error(`input "${name}" is required`)
      }

      if(tag.attributes[name]) {
        acc[name] = tag.attributes[name].value
      } else {
        acc[name] = input.default
      }

      return acc
    }, {})

    const fragment = renderTemplate(html, inputMap, handlers)

    // Set attribute to accept style
    fragment.setAttribute(NAME_ATTRIBUTE, name)

    // Set root styles
    inputs.forEach(input => {
      if (input.css) {
        fragment.style.setProperty(`--${input.name}`, inputMap[input.name])
      }
    })

    // Replace all root elements
    tag.parentNode.replaceChild(fragment, tag)
  }
}

export default async function widget (name) {
  const { result } = await widgetByName(name)
  render(result[0].row)
}
