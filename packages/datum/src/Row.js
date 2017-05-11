import Field from './Field'

export default function Row( relation, options ) {

  this.relation = relation
  this.schema = relation.schema
  this.row_data = response.result[0].row

  this.cached_fields = {}
  this.columns = response.columns || null
  this.pk_column_name = null
  this.pk_value = null
  this.id = null
  this.to_url = function() {
    console.error('You must call a row with "meta_data: true" in order to use the to_url function')
    throw 'Datum.js: Programming Error'
  }

  if (typeof response.pk != 'undefined') {
    this.pk_column_name = response.pk
    this.pk_value = this.get(this.pk_column_name)
    // this.id = {"pk_column_id":{"relation_id":{"schema_id":{"name":this.schema.name},"name":this.relation.name},"name":this.pk_column_name},"pk_value": this.pk_value}
    this.id = {
      pk_column_id: {
        relation_id: this.relation.id,
        name: this.pk_column_name
      },
      pk_value: this.pk_value
    }

    this.to_url = function( id_only ) {
      return id_only ? '/row/' + this.relation.schema.name + '/' + this.relation.name + '/' + /*JSON.stringify(this.pk_value)*/ this.pk_value :
        this.relation.schema.database.endpoint.url + '/row/' + this.relation.schema.name + '/' + this.relation.name + '/' + /*JSON.stringify(this.pk_value)*/ this.pk_value
    }

  }
}
/*
// get/set field
Row.prototype.update = function() {}
Row.prototype.delete = function() {}
*/

Row.prototype = {
  constructor: Row,
  get: function( name )           { return this.row_data[name] },
  set: function( name, value )    { this.row_data[name] = value; return this },
  toString: function()           { return JSON.stringify(this.row_data) },
  clone: function()               { return new AQ.Row(this.relation, { columns: this.columns, pk: this.pk_column_name, result: [{ row: this.row_data }]}) },
  field: function( name ) {
    if (typeof this.cached_fields[name] == 'undefined') {
      this.cached_fields[name] = new AQ.Field(this, name, name === this.pk_column_name)
    }
    return this.cached_fields[name]
  },
  fields: function() {
    if (this.columns != null) {
      return this.columns.map(function(c) {
        return this.field(c.name)
      }.bind(this))
    }
    return null
  }
}

Row.prototype.update = function() {
  return this.relation.schema.database.endpoint.patch(this, this.row_data)
    .then(function(response) {

      if(response == null) {
        throw 'Empty response'
      }
      return this

    }.bind(this)).catch(function(err) {
      throw 'Update failed: ' + err
    })
}

Row.prototype.delete = function() { 
  return this.relation.schema.database.endpoint.delete(this)
    .then(function(response) {

      if(response == null) {
        throw 'Empty response'
      }

    }).catch(function(err) {
      throw 'Delete failed: ' + err
    })
}

Row.prototype.relatedRows = function( self_column_name, related_relation_name, related_column_name, options )  {

  var relation_parts = related_relation_name.split('.')
  if (relation_parts.length < 2) {
    console.error("Related relation name must be schema qualified (schema_name.relation_name)")
    // throw "Related relation name must be schema qualified (schema_name.relation_name)"
  }

  var schema_name = relation_parts[0]
  var relation_name = relation_parts[1]
  var db = this.relation.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where == 'undefined' ?  [] : [options.where])
  options.where.push({
    name: related_column_name,
    op: '=',
    value: this.get(self_column_name)
  })

  return db.schema(schema_name).relation(relation_name).rows(options)
}

Row.prototype.relatedRow = function( self_column_name, related_relation_name, related_column_name, options ) {

  var relation_parts = related_relation_name.split('.')
  if (relation_parts.length < 2) {
    console.error("Related relation name must be schema qualified (schema_name.relation_name)")
    // throw "Related relation name must be schema qualified (schema_name.relation_name)"
  }

  var schema_name = relation_parts[0]
  var relation_name = relation_parts[1]
  var db = this.relation.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where == 'undefined' ?  [] : [options.where])
  options.where.push({
    name: related_column_name,
    op: '=',
    value: this.get(self_column_name)
  })

  return db.schema(schema_name).relation(relation_name).row(options)
}
