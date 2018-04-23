function isArray (item) {
  return Array.isArray(item)
}

function isObject (item) {
  return typeof item === 'object' && !isArray(item)
}

function isString (item) {
  return typeof item === 'string'
}

function resolveArguments (args) {
  let attributes, children, innerHTML

  if (args.length === 2) {
    if (isArray(args[1])) {
      children = args[1]
    } else if (isObject(args[1])) {
      attributes = args[1]
    } else if (isString(args[1])) {
      innerHTML = args[1]
    }
  } else if (args.length === 3) {
    attributes = args[1]

    if (isArray(args[2])) {
      children = args[2]
    } else if (isString(args[2])) {
      innerHTML = args[2]
    }
  }

  return { attributes, children, innerHTML }
}

function CSSObjectToString (obj) {
  return Object.keys(obj)
    .map(key => `${key}:${obj[key]}`)
    .join(';')
}

export default function createElement (tag) {
  const element = document.createElement(tag)

  if (arguments.length > 1) {
    const { attributes, children, innerHTML } = resolveArguments(arguments)

    if (attributes) {
      Object.keys(attributes).forEach(key => {
        let value = attributes[key]

        if (key === 'style' && isObject(value)) {
          value = CSSObjectToString(value)
        }

        element.setAttribute(key, value)
      })
    }

    if (children && children.length) {
      children.forEach(child => element.appendChild(child))
    } else if (innerHTML) {
      element.innerHTML = innerHTML
    }
  }

  return element
}
