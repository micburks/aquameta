export default function FunctionResult (fn, response) {
  this.function = fn
  this.schema = fn.schema
  this.rowData = response.result[0].row
  this.rows = response.result
  this.columns = response.columns
}

FunctionResult.prototype = {
  constructor: FunctionResult,
  get (name) {
    return this.rowData[name]
  },
  toString () {
    return JSON.stringify(this.rowData)
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

FunctionResult.prototype.relatedRows = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schema_name.relation_name)')
    // throw 'Related relation name must be schema qualified (schema_name.relation_name)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.function.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where === 'undefined' ? [] : [options.where])
  options.where.push({
    name: relatedColumnName,
    op: '=',
    value: this.get(selfColumnName)
  })

  return db.schema(schemaName).relation(relationName).rows(options)
}

FunctionResult.prototype.relatedRow = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schema_name.relation_name)')
    // throw 'Related relation name must be schema qualified (schema_name.relation_name)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.function.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where === 'undefined' ? [] : [options.where])
  options.where.push({
    name: relatedColumnName,
    op: '=',
    value: this.get(selfColumnName)
  })

  return db.schema(schemaName).relation(relationName).row(options)
}
