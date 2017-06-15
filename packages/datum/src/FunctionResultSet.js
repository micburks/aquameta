import FunctionResult from './FunctionResult'

export default function FunctionResultSet (fn, response) {
  this.function = fn
  this.schema = fn.schema
  this.columns = response.columns
  this.rows = response.result
}

FunctionResultSet.prototype.constructor = FunctionResultSet

FunctionResultSet.prototype.map = function (fn) {
  return this.rows.map(row => {
    return new FunctionResult(this.function, { columns: this.columns, result: [ row ] })
  }).map(fn)
}

FunctionResultSet.prototype.forEach = function (fn) {
  return this.rows.map(row => {
    return new FunctionResult(this.function, { columns: this.columns, result: [ row ] })
  }).forEach(fn)
}

FunctionResultSet.prototype.relatedRows = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schema_name.relation_name)')
    // throw 'Related relation name must be schema qualified (schema_name.relation_name)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.function.schema.database

  var values = this.map(function (row) {
    return row.get(selfColumnName)
  })

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where === 'undefined' ? [] : [options.where])
  options.where.push({
    name: relatedColumnName,
    op: 'in',
    value: values
  })

  return db.schema(schemaName).relation(relationName).rows(options)
}

FunctionResultSet.prototype.relatedRow = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schema_name.relation_name)')
    // throw 'Related relation name must be schema qualified (schema_name.relation_name)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.function.schema.database

  var values = this.map(function (row) {
    return row.get(selfColumnName)
  })

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where === 'undefined' ? [] : [options.where])
  options.where.push({
    name: relatedColumnName,
    op: 'in',
    value: values
  })

  return db.schema(schemaName).relation(relationName).row(options)
}
