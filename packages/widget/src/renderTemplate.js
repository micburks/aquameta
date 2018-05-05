import dot from 'dot'
import element from './element'
import parser from 'parse5'
import { NAME_ATTRIBUTE } from './constants'

//dot.templateSettings.spreadContext = true
dot.templateSettings.varname = 'input'

const domHandlers = [
  'onclick',
  'onkeyup',
  'onkeydown',
  'onkeypress',
  'onmouseover',
  'onmouseout',
  'onmousemove',
  'onmousedown',
  'onmouseup'
]

let counter = 0
export default function render (template, input, handlers) {
  const context = Object.assign({}, input, handlers)
  const domString = compile(template, context)
  const dom = parse(domString)

  return renderTemplate(dom, context)
}

// Compile dot template
function compile (template, input) {
  const templateFunction = dot.template(template)
  const nodeContent = templateFunction(input)

  return nodeContent
}

// Parse html string into AST
function parse (domString) {
  return parser.parseFragment(domString)
}

// Render root of AST into DOM elements
function renderTemplate (vdom, input) {
  const id = counter++
  const root = vdom.childNodes.find(el => el.nodeName !== '#text')

  return renderElement(root, input)
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
