// import 'babel-polyfill'
import js from './app/app.js'
import css from './app/app.css.js'
import html from './app/app.html.js'

import element from './element'
import renderTemplate from './renderTemplate'

import scope from 'scope-css'

const input = {
  variant: 'Component--cool',
  title: 'Hello World',
  paragraph: 'We made it',
  color: 'red'
}
const events = []
const widget = { html, css, js, events }

async function render ({ html, css, js, events }) {
    /*
  document.body.append(
    element('script', {
      type: 'module',
      src: jsPath
    })
  )
  */

  const handlers = events.reduce(async (acc, curr) => {
    const module = await import(curr)
    acc[curr] = module.default

    return acc
  }, {})

  const { id, idAttribute, fragment } = renderTemplate(html, input, handlers)
  const idSelector = `[${idAttribute}="${id}"]`

  document.body.append(fragment)

  document.head.appendChild(
    element('style', {
      rel: 'stylesheet',
      type: 'text/css',
      [`${idAttribute}-style`]: id
    },
      scope(css, idSelector)
    )
    //style.textContent = `${idSelector} { ${css} }`
  )
}

render(widget)
