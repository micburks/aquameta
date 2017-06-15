export default function FunctionResult (fn, response) {
  this.function = fn
  this.schema = fn.schema
  this.row_data = response.result[0].row
  this.rows = response.result
  this.columns = response.columns
}

FunctionResult.prototype = {
  constructor: FunctionResult,
  get (name) {
      return this.row_data[name]
  },
  to_string () {
      return JSON.stringify(this.row_data)
  }
}

FunctionResult.prototype.map = function (fn) {
  return this.rows.map(row => {
    return new FunctionResult(this.function, { columns: this.columns, result: [ row ] })
  }).map(fn)
}

FunctionResult.prototype.forEach = function (fn) {
  return this.rows.map(row => {
    return new FunctionResult(this.function, { columns: this.columns, result: [ row ] })
  }).forEach(fn)
}

FunctionResult.prototype.related_rows = function (self_column_name, related_relation_name, related_column_name, options)  {
  var relation_parts = related_relation_name.split('.')
  if (relation_parts.length < 2) {
    console.error("Related relation name must be schema qualified (schema_name.relation_name)")
    // throw "Related relation name must be schema qualified (schema_name.relation_name)"
  }

  var schema_name = relation_parts[0]
  var relation_name = relation_parts[1]
  var db = this.function.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where == 'undefined' ?  [] : [options.where])
  options.where.push({
    name: related_column_name,
    op: '=',
    value: this.get(self_column_name)
  })

  return db.schema(schema_name).relation(relation_name).rows(options)
}

FunctionResult.prototype.related_row = function (self_column_name, related_relation_name, related_column_name, options) {
  var relation_parts = related_relation_name.split('.')
  if (relation_parts.length < 2) {
    console.error("Related relation name must be schema qualified (schema_name.relation_name)")
    // throw "Related relation name must be schema qualified (schema_name.relation_name)"
  }

  var schema_name = relation_parts[0]
  var relation_name = relation_parts[1]
  var db = this.function.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where == 'undefined' ?  [] : [options.where])
  options.where.push({
    name: related_column_name,
    op: '=',
    value: this.get(self_column_name)
  })

  return db.schema(schema_name).relation(relation_name).row(options)
}
