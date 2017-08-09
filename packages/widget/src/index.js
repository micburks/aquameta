const dot = require('dot/doT.js')
//const $ = require('zepto')
import datum from 'aquameta-datum'

//dot.templateSettings.strip = false;

/************************/
/*
import { render, sync, setRenderer } from 'Widget'

// usage
render('core:list_view', {})
sync(rows, '.row_container', row => 
  widget('core:list_item', { row, selected: row === selected_row })
)
setRenderer('riot.tag', RiotRenderer)
// not sure about these next two
setRendererExt('.tag', 'riot.tag', RiotRenderer)
setRendererExt('.tag', RiotRenderer)

// RiotRenderer.js
export default RiotRenderer = {
  compile,
  render
}
// end RiotRenderer.js


// Renderer.js
export default WidgetRenderer = {
  compile,
  render
}
// end Renderer.js

*/
const curry = function(f) {
  const l = f.length
  return function cb(...args) {
    return args.length >= l ? f(...args) : cb.bind(null, ...args)
  }
}
//const datum = require('aquameta-datum')
const uuid = require('uuid')
import { requireSource, requireWidgetRow } from 'require-datum'
const _widgets = {}
const caches = {}
const sourceUrlRegex = /^\/db\/.*/
const endpoint = new datum()

const callerId = () => id
function render(/* curry the caller: caller, */ selector, options) {
  assert(selector, 'widget selector is required')

  const id = uuid()
  const context = Object.assign({}, options, { id, namespace })
  // const { datum, renderer, preRendered } = resolve(selector, context)

  // gets results of require
  const { module } = resolve(selector, options)

  // widget has resolve to find correct call
  // if source url (or any non-function call, for now), use require
  // else use loaders
  // require().then(_getWidgetData).then(compile)?

  // dont think about this now
  // Compiled server-side?
  if (preRendered) {
    const sourceUrl = '/db/schema/table/row.rendered'
    // TODO: passing in variables? is this even feasible?
    // mimetype problems?
    return '<script src="' + sourceUrl + '"></script>'
  }

  // for later: !inputs, Xdeps, Xviews
  // TODO: need to fetch associated data

  // Compiled client-side
  //_widgets[id] = datum.then(compile(context)).catch(error)
  datum.then(staticRequires)

  return
    `<script id="widget-stub_${context.id}" data-widget_id="${context.id}">` +
      `widget._swap(${context.id})` + 
    `</script>`

  // Can't guarantee script tag will be on page when rendering is finished
  // Need to apply widget to page as above (old method)
  // return '<script id="' + id + '"></script>'

}

function staticRequires( datum ) {
  return datum
}

/**
 * RESOLVE step
 * Resolve request to a specific loader
 */
function resolve(selector, datum) {

  // Get extension
  let [ widget, ext, extra ] = selector.split('.')
  assert(!extra, 'invalid extension')

  // Source url lookup -- /db/schema/relation/widgetName.column
  if (sourceUrlRegex.test(widget)) {
    return loaders.source(widget)
  }

  // Semantics lookup -- semantics/widgetPurpose
  if ( ~widget.indexOf('/') ) {
    let [ semantics, purpose ] = widget.split('/')
    return loaders.semantics(purpose, datum)
  }

  // Bundle-centric lookup -- bundleName:widgetName
  if ( ~widget.indexOf(':') ) {
    let [ bundleName, widgetName ] = widget.split(':')
    return loaders.bundle(bundleName, widgetName)
  }

  // Default widget lookup
  // return loaders.bundle(bundleName, widget)
  return loaders.default(widget, ext)
}

/**
 * LOADER step
 * Load the widget and its dependencies
 * Cache results
 */
const loaders = {

  source( path ) {
    return requireSource(path)
  },

  semantics( purpose, /* not datum */ datum ) {
    assert(datum, 'semantics requires a datum')

    const context = extra || {}
    const semantics = selector.split('/')
    const args_object = {}

    // If datum is a promise (that will resolve as a Rowset or a Row), resolve it first
    if (datum instanceof Promise) {

      var url_id
      const widgetRequest = datum.then(function(input) {

        context.datum = input;

        // These are the same for both Rowset and Row
        var endpoint = input.relation.schema.database;
        var fn = 'relation_widget';
        var type = 'meta.relation_id';
        args_object.relation_id = input.relation.id;

        if (input instanceof AQ.Rowset) {
          context.rows = input;
          url_id = input.relation.to_url(true);
        }
        else if (input instanceof AQ.Row) {
          context.row = input;
          url_id = input.to_url(true);
        }
        args_object.widget_purpose = semantics[1];
        args_object.default_bundle = semantics.length >= 3 ? semantics[2] : 'com.aquameta.core.semantics';

        return endpoint.schema('semantics').function({
          name: fn,
          parameters: [type,'text','text']
        }, args_object, { use_cache: true, meta_data: false });

      });

    }
    // Else, check which type it is
    else {

      context.datum = datum;
      const { endpoint } = datum

      if (datum instanceof AQ.Relation || datum instanceof AQ.Table || datum instanceof AQ.View) {
        var endpoint = datum.schema.database;
        var fn = 'relation_widget';
        var type = 'meta.relation_id';
        args_object.relation_id = datum.id;
        var url_id = datum.to_url(true);
        context.relation = datum;
      }
      else if (datum instanceof AQ.Row) {
        var endpoint = datum.relation.schema.database;
        var fn = 'relation_widget';
        var type = 'meta.relation_id';
        args_object.relation_id = datum.relation.id;
        var url_id = datum.to_url(true);
        context.row = datum;
      }
      else if (datum instanceof AQ.Rowset) {
        var endpoint = datum.relation.schema.database;
        var fn = 'relation_widget';
        var type = 'meta.relation_id';
        args_object.relation_id = datum.relation.id;
        var url_id = datum.relation.to_url(true);
        context.rows = datum;
      }
      else if (datum instanceof AQ.Column) {
        var endpoint = datum.relation.schema.database;
        var fn = 'column_widget';
        var type = 'meta.column_id';
        args_object.column_id = datum.id;
        var url_id = datum.relation.to_url(true);
        context.column = datum;
      }
      else if (datum instanceof AQ.Field) {
        var endpoint = datum.row.relation.schema.database;
        var fn = 'column_widget';
        var type = 'meta.column_id';
        args_object.column_id = datum.column.id;
        var url_id = datum.to_url(true);
        context.field = datum;
      }

      args_object.widget_purpose = semantics[1];
      args_object.default_bundle = semantics.length >= 3 ? semantics[2] : 'com.aquameta.core.semantics';

      var widgetRequest = endpoint.schema('semantics').function({
        name: fn,
        parameters: [type,'text','text']
      }, args_object, { use_cache: true, meta_data: false })
    }

    // Go get this widget - retrieve_promises don't change for calls to the same widget - they are cached by the widget name
    const widgetDatum = widgetRequest
      .catch(err => {
        throw 'Widget not found from semantic lookup with ' + selector.semanticSelector + ' on ' + selector.urlId
      })

    return requireWidgetRow(widgetDatum)
    /*
      .then(getWidgetData)
      */

  },

  bundle( bundleName, widgetName ) {
    assert(bundleName in namespaces, `widget namespace ${ bundleName } has not been imported`)

    const widgetDatum = namespaces[bundleName].endpoint.schema('widget').function('bundled_widget',
      [ namespaces[context.namespace].bundleName, context.name ], {
        use_cache: true,
        meta_data: false
      })
    /*
      .then(getWidgetData)
      .catch(err => {
        throw 'Widget does not exist, ' + bundleName + ':' + widgetName
      })
      */

    return requireWidgetRow(widgetDatum)

  },

  default( widgetName, extension ) {
    // TODO: Need to be able to look up in different table with different column for plugins
    //return datum.schema('widget').relation('widget').row('name', widgetName)

    return this.bundle(context.namespace, widgetName)
  }
}

// Get all related widget data
function getWidgetData( row ) {

  //const semanticLookup = 'semanticSelector' in selector
  const options = { useCache: true, metaData: true }

  return Promise.all([
    // widget row
    row,

    // widget input rows
    row.relatedRows('id', 'widget.input', 'widget_id', options),

    // widget views
    row.relatedRows('id', 'widget.widget_view', 'widget_id', options)
      .then(widgetViews =>
        widgetViews.map(widget_view => {
          const viewId = widget_view.get('view_id')
          return row.schema.database.schema(viewId.schema_id.name).view(viewId.name)
        })),

    // widget dependencies
    row.relatedRows('id', 'widget.widget_dependency_js', 'widget_id', options)
      .then(depsJs => {
        if (depsJs.length) {
          return depsJs.related_rows('dependency_js_id', 'widget.dependency_js', 'id', options)
        }
      })
      .then(deps =>
        Promise.all(
          deps.map(dep =>
            System.import(dep.field('content').toUrl())
              .then(depModule => ({
                  url: dep.field('content').toUrl(),
                  name: dep.get('variable') || 'non_amd_module',
                  /* TODO: This value thing is a hack. For some reason, jwerty doesn't load properly here */
                  value: typeof depModule == 'object' ? depModule[Object.keys(depModule)[0]] : depModule
                  //value: dep_module
              }))
          )))
    .then(all => {
      const [ widgetRow, inputs, views, depsJs ] = all
      return {
        widgetRow,
        inputs,
        views,
        depsJs
      }
    })
  ])
}

// combine compile and _prepare
const compile = curry(( context, request ) => {

  return request.then(widgetData => {

    const { widgetRow, inputs, views, depsJs } = widgetData
    context.name = widgetRow.get('name')

    // Process inputs
    if (inputs) {
      inputs.forEach(input => {
        const inputName = input.get('name');
        if (inputName in context) {
          if (input.get('optional')) {
            const defaultCode = input.get('default_value')
            try {
              if (defaultCode) {
                context[inputName] = eval('(' + defaultCode + ')')
              }
              else {
                context[inputName] =  undefined
              }
            }
            catch (e) {
              error(e, context.name, "Widget default eval failure: " + defaultCode)
            }
          }
          else {
            error('Missing required input ' + inputName, context.name, 'Inputs')
          }
        }
        context.input[inputName] = context[inputName]
      })
    }

    // Load views into context
    if (views) {
      views.reduce((acc, view) => {
        return acc[view.schema.name + '_' + view.name] = view
      }, context)
    }

    // Create html template
    const htmlTemplate = dot.template(widgetRow.get('html') || '')

    // Compile html template
    let html = null
    try {
      html = htmlTemplate(context)
    } catch(e) {
      error(e, context.name, 'HTML')
    }

    // Render html
    html = document.createElement(html)
    try {
      html.dataset['data-widget'] = context.name
      html.dataset['data-widget_id'] = context.id
        //.data('help', widgetRow.get('help'))
    } catch(e) {
      error(e, context.name, 'HTML (adding data-* attributes)')
    }

    // If CSS exists and has not yet been applied
    if (widgetRow.get('css') != null && document.querySelectorAll('style[data-widget="' + context.name + '"]').length == 0) {

      // Create css template
      const cssTemplate = dot.template(widgetRow.get('css') || '')

      // Try to run css template
      try {
        var css = cssTemplate(context)
      } catch(e) {
        error(e, context.name, 'CSS')
      }

      // Add css to dom
      const styleTag = document.createElement('<style type="text/css">' + css + '</style>')
      styleTag.dataset['data-widget'] = context.name
      document.head.appendChild(styleTag)
    }


    // Get context values
    const contextKeys = Object.keys(context).sort()
    const contextVals = contextKeys.map(key => context[key])

    // Dependency names and values
    const depNames = [], depValues = []
    if (depsJs) {
      depsJs.forEach(dep_js => {
        depNames.push(depJs.name)
        depValues.push(depJs.value)
      })
    }

    try {
      /*
      * Creating an script that looks like this
      * function(dep1_name, dep2_name, ...) {
      *   function(input1, input2) {
      *       post_js
      *   }.apply(this.this.context_vals);
      * }.apply(this, this.dep_vals);
      */
      const js = Function(
        '(function(' + depNames.join(',') + ') { \n' +
          '(function(' + contextKeys.join(',') + ') { \n' +
            'var w = $("#"+id);\n\n' +
            widgetRow.get('post_js') +
            '\n//# sourceURL=' + widgetRow.get('id') + '/' + widgetRow.get('name') + '/post_js\n' +
          '}).apply(this, this.contextVals)' +
        '}).apply(this, this.depValues)'
      ).bind({ contextVals: contextVals, depValues: depValues })
    }
    catch(e) {
      error(e, widgetRow.get('name'), 'Creating post_js function')
    }

    // Return rendered widget and post_js function
    return {
      html,
      widgetId: context.id,
      widgetName: context.name,
      js
    }
  })
})

// detect svg widgets by tag name.  might be better to check the dom to see if we're inside an svg tag?
function isSvg( e ) {
  // TODO: add more, or change approach?
  const svgTags = ['circle','rect','polygon','g']
  return ~svgTags.indexOf(e.tagName.toLowerCase())
}

function _swap( id ) {
  const el = document.getElementById(`widget-stub_${id}`)
  _widgets[id].then(renderedWidget => {

    const { html, widgetId, widgetName, js } = renderedWidget

    // Replace stub
    // special case for svg elements - http://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
    if (isSvg(html)) { // TODO: is there ever a case where there is more than one element in this array?
      const div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
      div.innerHTML= `<svg xmlns="http://www.w3.org/2000/svg">${html.outerHTML}</svg>`

      const frag = document.createDocumentFragment()
      while (div.firstChild.firstChild)
        frag.appendChild(div.firstChild.firstChild)

      el.replaceWith(frag)
    }
    else {
      el.replaceWith(html)
    }

    // Run post_js - or this may have to be done with a script tag appended to the widget
    try {
      js()
    }
    catch(e) {
      error(e, widgetName, 'Running post_js function')
    }

    const w = document.getElementById(widgetId)

    // notify the world that a widget has loaded.  debugger uses this to detect widget tree changes
    w.dispatchEvent(new CustomEvent('widgetLoaded', { widget: w }))

    // Delete compiled widget
    // delete _widgets[id]

  })
  .catch(error => {
    //console.error('Widget swap failed - ', error);
    console.error(error)
    // Remove stub
    el.remove()
    // Delete compiled widget
    delete _widget[id]
  })
}



function error( err, widgetName, stepName ) {
  console.error(`widget ${ widgetName } failed at step ${ stepName }`)
  throw err
}



/*export */function sync( rowset_promise, container, widget_maker, handlers ) {

  if (handlers === undefined) {
    handlers = {}
  }

  if (widget_maker === undefined) {
    throw 'widget.sync missing widget_maker argument'
  }

  if (container.length < 1) {
    throw 'widget.sync failed: The specified container is empty or not found'
    return
  }

  if (container.length > 1) {
    throw 'widget.sync failed: The specified container contains multiple elements'
    return
  }

  /*
  if (!container instanceof jQuery) {
    throw 'widget.sync failed: The specified container is not a jQuery object'
    return
  }
  */

  /*
  if (typeof rowset_promise == 'undefined' ||
    (!(rowset_promise instanceof Promise) && !(rowset_promise instanceof AQ.Rowset))) {
    throw 'widget.sync failed: rowset_promise must be a "thenable" promise or a resolved AQ.Rowset'
  }
  */

  if ( !(rowset_promise instanceof Promise) ) {
    rowset_promise = Promise.resolve(rowset_promise)
  }

  rowset_promise.then(rowset => {

    if (typeof rowset == 'undefined' || typeof rowset.forEach == 'undefined') {
      throw 'Rowset is not defined. First argument to widget.sync must return a Rowset'
    }

    var containerId = uuid()

    container.attr('data-container_id', containerId)
    containers[containerId] = {
      container: container,
      widget_maker: widget_maker,
      handlers: handlers
    }

    rowset.forEach(row => {
      container.append(widget_maker(row))
    })

  }).catch(function(error) {
    console.error('widget.sync failed: ', error)
  })

}
module.exports.sync = sync




/*

var widget = new Widget()
widget()
widget.render()
widget.sync()

export function Widget( config ) {

  const defaultConfig = {
    default: WidgetRenderer
  }

  // Object.assign
  this.config = Object.keys(config)
    .reduce((acc, key) => {
      acc[key] = config[key]
      return acc
    }, defaultConfig)

  this._renderers = {
    default: new this.config.default(this.config)
  }

  // Backwards compatibility
  const backwardCompatibility = () {
    console.warn('widget() is deprecated. Please use widget.render() instead')
    return this.render(arguments)
  }
  backwardCompatibility.render = this.render
  backwardCompatibility.sync = this.sync

  return backwardCompatibility
}

function WidgetResolver() { }

Widget.prototype.widget = function() { }
Widget.prototype.render = function() {}
Widget.prototype.sync = function() {}

export function WidgetRenderer( config ) {
  this.config = config
  this._widgets = {}
}

export function semantics() {
}


WidgetRenderer.prototype.fetch = function( bundleName, name ) {
  return datum.schema('widget').table('widget').row('name', selector)
  .then()
  return Promise()
}

WidgetRenderer.prototype.prepare = function() {
}

WidgetRenderer.prototype.render = function() {
  return this.retrieve()
  .then(this.prepare)
  .then(this.compile)
  .catch(error)
}
*/

/* Import a bundle name to a local namespace */
/*export function*/ module.exports.import = function( bundleName, namespace, endpoint ) {
  namespaces[namespace] = {
    endpoint: endpoint,
    bundleName: bundleName
  }
}

/* Return an array bundle of imported bundle names */
var bundles = function() {
  return Object.keys(namespaces).map(function(key) {
    return namespaces[key].bundle_name;
  });
};

/* Find the bundle that was imported to this namespace */
var bundle = function( namespace ) {
  return namespaces[namespace].bundle_name;
};

/* Find the namespace that uses this bundle */
var namespace = function( bundle_name ) {
  return Object.keys(namespaces).find(function(namespace) {
    return namespaces[namespace].bundle_name == bundle_name;
  });
};

