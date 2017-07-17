import Relation from './Relation'
import Fn from './Function'
import FnResult from './FunctionResult'
import FnResultSet from './FunctionResultSet'

export default function Schema (endpoint, name) {
  this.endpoint = endpoint
  this.name = name
  this.id = { name: this.name }
  this._relations = {}
}

Schema.prototype.relation = function (name) {
  if (!(name in this._relations)) {
    this._relations[name] = new Relation(this, name)
  }
  return this._relations[name]
}

Schema.prototype.function = function (identifier, args, options) {
  let name
  // Function identifier (name and parameter list)
  if (typeof identifier === 'object') {
    name = identifier.name
    var parameterTypeList = identifier.parameters
  } else { // Selecting a function without specifying the parameters
    name = identifier
  }

  options = options || {}

  // Arguments
  options.args = {}

  // `args = undefined` will pass no arguments into the server-side function
  if (typeof args !== 'undefined') {
    // some_function?args={ kwargs: {} } -- Key/value object
    if (!(args instanceof Array) && args instanceof Object) {
      options.args.kwargs = args
    } else { // some_function?args={ vals: [] } -- Array
      if (!(args instanceof Array)) {
        // Regular value is placed into array
        args = [ args ]
      }
      options.args.vals = args
    }
  }

  var fn = new Fn(this, name, parameterTypeList)

  return this.database.endpoint.get(fn, options)
    .then(response => {
      if (!response) {
        throw new Error('Empty response')
      } else if (!response.result.length) {
        throw new Error('Result set empty')
      }
      if (response.result.length > 1) {
        return new FnResultSet(fn, response)
      }
      return new FnResult(fn, response)
    }).catch(err => {
      throw new Error('Function call request failed: ' + err)
    })
}
