import datum from 'aquameta-datum'

// There is an extra step that webpack does not have
//
// Webpack during build will fetch these files
//  Modules are stored in an array of module code
//  * Our require will store modules in memory
//
// Webpack's require then will install the module when called (or retrieve from cache)
//  Installed modules are stored in a private object
//  * Our require will do the same

const _modules = {}
const _fetchingModules = {}
const _installedModules = {}

/**
 * Cache module code under a url
 */
const _cache = function (url, datum) {
  return datum.then(module => {
    _modules[url] = module
    return datum
  })
}

/**
 * Require module from source url
 */
export requireSource = function( url ) {
  const sourceUrlRegex = /^\/db\//
  assert(sourceUrlRegex.test(url), 'url must be a source url')

  if (url in _modules) {
    return _modules[url]
  }

  const [ , schema, relation, id ] = url.split('/')
  const [ name, extension ] = id.split('.')
  const [ column, query ] = exention.split('?')
  let where = query.split('&').reduce((acc, current) => {
    let [ key, value ] = current.split('=')
    acc[key] = value
    return acc
  }, {})
  where = Object.assign(where, { name })
  const datum = schema(schema).relation(relation).row({ where, column })

  const wrapper = column in wrappers ? wrappers[column] : wrappers.default

  return _cache(url, datum.then(wrapper))
}

/**
 * Require module from datum
 */
export requireWidgetRow = function( datum, relatedData, zip ) {
  assert(arguments.length > 0, 'requireWidgetRow requires a datum to load as a module')

  const url = datum.url()
  if (url in _modules) {
    return _modules[url]
  }

  if (typeof relatedData === 'undefined' || relatedData === null) {
    relatedData = x => x
  }
  if (typeof zip === 'undefined' || zip === null) {
    zip = relatedData
    relatedData = x => x
  }

  // where are we analyzing the widget to return others
  
  // TODO: Analyze js column
  return _cache(url, datum.then(relatedData).then(zip))
}

// What does a column select even look like from datum?
// Is this all necessary?
// What does it look like I'm building?
const wrappers = {
  json( data ) {
    return `(function(module, exports) { module.exports=${data} })`
  },

  css( data ) {
    // TODO: imitate webpack css-loader here?
    // We want to follow @import/url() when the css data is loaded
    // Each css file will be a module in js
    // then a style-loader will put the css in the head like this wrapper

    // Add css to dom
    const styleString = `<style type='text/css'>${data}</style>`
    const styleTag = document.createElement(styleString)
    // styleTag.dataset['data-widget'] = context.name
    document.head.appendChild(styleTag)
    return styleTag
  },

  js( data ) {
    // babel transform
    // find other require's
    // fetch requires
    // install this module?
  },

  default( data ) {
    // entire row
    // Row
    return data
  }
}
