import 'babel-polyfill'
import js from './app/app.js'
import css from './app/app.css.js'
import html from './app/app.html.js'

let counter = 0
const input = {
  variant: 'Component--cool',
  title: 'Hello World',
  paragraph: 'We made it',
  color: 'red'
}

Promise.all([
  import('dot'),
  import('parse5'),
  import('scope-css')
]).then(([ dot, parse, scope ]) => {
  console.log('got', { dot, parse, scope })
  const jsPath = './app/app.js'

  /*
  const template = document.createElement('template')
  template.id = '1'
  template.innerHTML = html
  document.body.appendChild(template)
  */

  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.setAttribute('src', jsPath)
  document.body.append(script)

  ;(async function () {
    const id = counter++
    const idAttribute = 'data-widget-name'
    const idSelector = `[${idAttribute}="${id}"]`
    // const { default: appJs } = await import(jsPath)
    js()

    dot.templateSettings.varname = 'input'
    const templateFunction = dot.template(html)
    const nodeContent = templateFunction(input)
    document.body.firstElementChild.setAttribute(idAttribute, id)
    document.body.firstElementChild.innerHTML = nodeContent
    for (let prop in input) {
      document.body.firstElementChild.style.setProperty(`--${prop}`, input[prop])
    }

    const style = document.createElement('style')
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('type', 'text/css')
    style.setAttribute(`${idAttribute}-style`, id)
    // gonna need a more complicated build here becuase :root
    style.textContent = scope.default(css, idSelector)
    //style.textContent = `${idSelector} { ${css} }`
    document.head.appendChild(style)
  })()
})
