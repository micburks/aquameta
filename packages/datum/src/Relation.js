import Rowset from './Rowset'
import Row from './Row'

function Relation(schema, name) {
  this.schema = schema
  this.name = name
  //console.log('Relation', schema.endpoint.connectionForRequest, name)
  this.id = { schema_id: this.schema.id, name: this.name }
}

Relation.prototype.toUrl = function() {
  return `relation/${this.schema.name}/${this.name}`
  /* idOnly param
  return id_only ? '/relation/' + this.schema.name + '/' + this.name :
    this.schema.database.endpoint.url + '/relation/' + this.schema.name + '/' + this.name
    */
}

Relation.prototype.column = function( name ) {
  return new AQ.Column(this, name)
}

Relation.prototype.rows = function( options ) {
  return this.schema.endpoint.get(this, options)
    .then(rows => {

      if (rows == null) {
        throw 'Empty response'
      }
      else if (rows.result.length < 1) {
        throw 'No rows returned'
      }

      return new Rowset(this, rows, options)

    })
    .catch(err => {
      throw 'Rows request failed: ' + err
    })
}

Relation.prototype.row = function( options ) {
  this.schema.endpoint.get(this, options).then(result => {
    return new Row(this, result)
  })

  /*
  // Multiple different ways to call 'row' function

  // 1. Calling with Options object
  if (typeof arguments[0] == 'object') {

    var obj = arguments[0]
    var args = arguments[1] || {}

    // AQ.Relation.row({ where: { column_name: 'column_name', op: '=', value: 'value' } })
    // Maybe it should be this one: AQ.Relation.row({ where: { column_name: value } })
    if (typeof obj.where != 'undefined') {
      args.where = obj.where
    }
// AQ.Relation.row({ column_name: 'column_name', op: '=', value: 'value' })
// Maybe it should be this one: AQ.Relation.row({ column_name: value })
    else {
      args.where = obj
    }

  }
// 2. Calling with column_name and value
  else if (typeof arguments[0] == 'string') {

    // AQ.Relation.row(column_name, value [, options_obj])
    var name = arguments[0]
    var value = arguments[1]
    var args = arguments[2] || {}

    args.where = { name: name, op: '=', value: value }

  }
// 3. Calling AQ.Relation.row() without arguments
  else {
    var args = {}
  }

  return this.schema.database.endpoint.get(this, args)
    .then(function(row) {

      if (row == null) {
        throw 'Empty response'
      }
      else if (row.result.length == 0) {
        throw 'No row returned'
      }
      else if (row.result.length > 1) {
        throw 'Multiple rows returned'
      }
      return new AQ.Row(this, row)

    }.bind(this)).catch(function(err) {
      throw 'Row request failed: ' + err
    })
    */
}

Relation.prototype.insert = function( data, options ) {

  if (typeof data === 'undefined') {
    // table.insert({}) is equivalent to table.insert()
    // both will insert default values
    data = {}
  }

  return this.schema.endpoint.patch(this, {}, data)
    .then(result => {

      if (!result) {
        throw 'Empty response'
      }
      if (result.length === 1) {
        return new Rowset(this, result, null)
      }
      return new Row(this, result)

    })
    .catch(err => {
      throw 'Insert failed: ' + err
    })
}

export default Relation
