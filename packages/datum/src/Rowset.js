import Field from './Field'

//function Rowset( relation, options ) {
function Rowset( relation, response, server_arguments ) {
  console.log('in rowset', response)
  this.relation = relation
  this.schema = relation.schema
  this.columns = response.columns || null
  this.pk_column_name = response.pk || null
  this.rows = response.result
  this.length = response.result.length
  this.server_arguments = server_arguments || {}
}

// get/set field
Rowset.prototype.update = function() {}
Rowset.prototype.delete = function() {}

Rowset.prototype.map = function(fn) {
  return this.rows.map(function(row) {
    return new Row(this.relation, { columns: this.columns, pk: this.pk_column_name, result: [ row ] })
  }.bind(this)).map(fn)
}

Rowset.prototype.forEach = function(fn) {
  return this.rows.map(function(row) {
    return new Row(this.relation, { columns: this.columns, pk: this.pk_column_name, result: [ row ] })
  }.bind(this)).forEach(fn)
}

Rowset.prototype.reload = function() {
  return this.relation.rows(this.server_arguments)
}

/**
 * Call AQ.Rowset.where with (where_obj) or use shorthand notation (field, value) - filter results programmatically
 *
 * @param {Object} where_obj
 * @param {[Boolean]} return_first
 * @param {[Boolean]} async
 *
 * OR
 *
 * @param {String} field
 * @param {Any} value
 * @param {[Boolean]} return_first
 * @param {[Boolean]} async
 *
 * @returns {Promise}
 */
Rowset.prototype.where = function() {

  var first = false, async = true, where_obj = {}
  if (typeof arguments[0] == 'object') {
    // AQ.Rowset.where(where_obj [, return_first] [, async])
    where_obj = arguments[0]
    var field = where_obj.field
    var value = where_obj.value
    if (arguments.length > 1) first = arguments[1]
    if (arguments.length > 2) async = arguments[2]

  }
  else if (typeof arguments[0] == 'string' && arguments.length > 1) {
    // AQ.Rowset.where(field, value [, return_first] [, async])
    var field = arguments[0]
    var value = arguments[1]
    if (arguments.length > 2) first = arguments[2]
    if (arguments.length > 3) async = arguments[3]
  }

  return new Promise(function(resolve, reject) {

    // TODO lots of logic here
    // The new rowset that is returned must be in the same format as the response from the server

    if (first) {
      for (var i = 0; i < this.rows.length; i++) {
        if (this.rows[i].row[field] == value) {
          resolve(new AQ.Row(this.relation, { columns: this.columns, result: [ this.rows[i] ] }))
        }
      }
      reject('could not find ' + field + ' ' + value)
    }
    else {
      var return_rowset = []
      for (var i = 0; i < this.rows.length; i++) {
        if (this.rows[i].row[field] == value) {
          return_rowset.push(this.rows[i])
        }
      }
      resolve(new AQ.Rowset(this.relation, { columns: this.columns, result: return_rowset }))
    }


    // 2

    // maybe we don't need to search the entire row and instead we return the first item found
    /*
       var new_rowset = _.filter(this.rows, function(el) {
    //return AQ.equals.call(this, el[field], val)
    })
    */
    if (new_rowset.length == 1) {
      return new AQ.Row(this.relation, new_rowset)
    }
    else if (new_rowset.length > 1) {
      throw 'Multiple Rows Returned'
    }

    // if row does not exist
    return null

  }.bind(this))

}

Rowset.prototype.orderBy = function( column, direction ) {
  /*
     var ordered = _.sortBy(this.rows, function(el) {
     return el.row[column]
     })
     */
  if (direction !== 'asc') {
    ordered.reverse()
  }
  return new AQ.Rowset(this.relation, { columns: this.columns, result: ordered })
}

Rowset.prototype.limit = function( lim ) {
  if (lim <= 0) {
    throw 'Bad limit'
  }
  return new AQ.Rowset(this.relation, { columns: this.columns, result: this.rows.slice(0, lim) })
}

Rowset.prototype.relatedRows = function( self_column_name, related_relation_name, related_column_name, options ) {

  var relation_parts = related_relation_name.split('.')
  if (relation_parts.length < 2) {
    console.error("Related relation name must be schema qualified (schema_name.relation_name)")
    // throw "Related relation name must be schema qualified (schema_name.relation_name)"
  }

  var schema_name = relation_parts[0]
  var relation_name = relation_parts[1]
  var db = this.relation.schema.database

  var values = this.map(function(row) {
    return row.get(self_column_name)
  })

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where == 'undefined' ?  [] : [options.where])
  options.where.push({
    name: related_column_name,
    op: 'in',
    value: values
  })


  return db.schema(schema_name).relation(relation_name).rows(options)
}

Rowset.prototype.relatedRow = function( self_column_name, related_relation_name, related_column_name, options ) {

  var relation_parts = related_relation_name.split('.')
  if (relation_parts.length < 2) {
    console.error("Related relation name must be schema qualified (schema_name.relation_name)")
    // throw "Related relation name must be schema qualified (schema_name.relation_name)"
  }

  var schema_name = relation_parts[0]
  var relation_name = relation_parts[1]
  var db = this.relation.schema.database

  var values = this.map(function(row) {
    return row.get(self_column_name)
  })

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where == 'undefined' ?  [] : [options.where])
  options.where.push({
    name: related_column_name,
    op: 'in',
    value: values
  })

  return db.schema(schema_name).relation(relation_name).row(options)

}

export default Rowset
