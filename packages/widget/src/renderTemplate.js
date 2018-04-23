import dot from 'dot'
import parser from 'parse5'
import element from './element'

console.log({ parser })

dot.templateSettings.varname = 'input'

const domHandlers = [
  'onclick'
]

let counter = 0
export default function render (template, input, handlers) {
  const domString = compile(template, input)
  const dom = parse(domString)

  return renderTemplate(dom, input, handlers)
}

function compile (template, input) {
  const templateFunction = dot.template(template)
  const nodeContent = templateFunction(input)

  return nodeContent
}

function parse (domString) {
  const a = parser.parseFragment(domString)
  console.log(a)
  return a
}

function renderTemplate (vdom, input, handlers) {
  const id = counter++
  const idAttribute = 'data-widget-name'

  const root = vdom.childNodes.find(el => el.nodeName !== '#text')

  const fragment = renderElement(root, input, handlers)
  fragment.setAttribute(idAttribute, id)
  console.log(fragment)

  for (let prop in input) {
    fragment.style.setProperty(`--${prop}`, input[prop])
  }

  return { id, idAttribute, fragment }
}

function renderElement (el, input, handlers = {}) {
  if (el.nodeName === '#text') {
    return document.createTextNode(el.value)
  } else {
    const children = el.childNodes.map(child => renderElement(child, input, handlers))
    const attrs = el.attrs.reduce((acc, { name, value }) => {
      acc[name] = value
      return acc
    }, {})
    const domEvents = []
    const data = {}

    for (let attr in attrs) {
      if (domHandlers.indexOf(attr) >= 0) {
        delete attrs[attr]
        domEvents.push(attr)
      } else if (/data-/.test(attr)) {
        data[attr.replace(/data-/, '')] = attrs[attr]
      }
    }

    const domElement = element(el.nodeName, attrs, children)

    domEvents.forEach(domEvent => {
      const event = domEvent.replace(/^on/, '')
      const handler = handlers[el.attrs[domEvent]]

      domElement.addEventListener(event, function (event) {
        event.data = data
        handler(event)
      })
    })

    return domElement
  }
}

  /*
const cache = {}
function update (id, render) {
  const container = document.getElementById(id)
  const newChild = render()

  if (cache[id]) {
    container.replaceChild(newChild, cache[id])
  } else {
    container.appendChild(newChild)
  }

  cache[id] = newChild
}
*/
