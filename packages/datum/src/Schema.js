import Relation from './Relation'
import Fn from './Function'

export default function Schema( endpoint, name ) {
  this.endpoint = endpoint
  this.name = name
  this.id = { name: this.name }
}

Schema.prototype.relation = function( name ) {
  return new Relation(this, name)
}

Schema.prototype.function = function( identifier, args, options ) {

  // Function identifier (name and parameter list)
  if (typeof identifier == 'object') {
    var name = identifier.name
    var parameter_type_list = identifier.parameters
  }
  // Selecting a function without specifying the parameters
  else {
    var name = identifier
  }

  options = options || {}

  // Arguments
  options.args = {}

  // `args = undefined` will pass no arguments into the server-side function
  if (typeof args != 'undefined') {

    // some_function?args={ kwargs: {} } -- Key/value object
    if (!(args instanceof Array) && args instanceof Object) {
      options.args.kwargs = args
    }
    // some_function?args={ vals: [] } -- Array
    else {
      if (!(args instanceof Array)) {
        // Regular value is placed into array
        args = [ args ]
      }
      options.args.vals = args
    }
  }

  var fn = new Fn(this, name, parameter_type_list)

  return this.database.endpoint.get(fn, options)
    .then(function(response) {

      if (!response) {
        throw 'Empty response'
      }
      else if (!response.result.length) {
        throw 'Result set empty'
      }
      if(response.result.length > 1) {
        return new FnResultSet(fn, response)
      }
      return new FnResult(fn, response)

    }.bind(this)).catch(function(err) {
      throw 'Function call request failed: ' + err
    })
}
