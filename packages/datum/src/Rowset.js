import Row from './Row'

// function Rowset (relation, options) {
export default function Rowset (relation, response, serverArguments) {
  console.log('in rowset', response)
  this.relation = relation
  this.schema = relation.schema
  this.columns = response.columns || null
  this.pkColumnName = response.pk || null
  this.rows = response.result
  this.length = response.result.length
  this.serverArguments = serverArguments || {}
}

// get/set field
Rowset.prototype.update = function () {}
Rowset.prototype.delete = function () {}

Rowset.prototype.map = function (fn) {
  return this.rows.map(row => {
    return new Row(this.relation, { columns: this.columns, pk: this.pkColumnName, result: [ row ] })
  }).map(fn)
}

Rowset.prototype.forEach = function (fn) {
  return this.rows.map(row => {
    return new Row(this.relation, { columns: this.columns, pk: this.pkColumnName, result: [ row ] })
  }).forEach(fn)
}

Rowset.prototype.reload = function () {
  return this.relation.rows(this.serverArguments)
}

/**
 * Call Rowset.where with (where_obj) or use shorthand notation (field, value) - filter results programmatically
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
Rowset.prototype.where = function () {
  let first = false
  let async = true
  let whereObj = {}
  let field
  let value
  if (typeof arguments[0] === 'object') {
    // Rowset.where(where_obj [, return_first] [, async])
    whereObj = arguments[0]
    field = whereObj.field
    value = whereObj.value
    if (arguments.length > 1) first = arguments[1]
    if (arguments.length > 2) async = arguments[2]
  } else if (typeof arguments[0] === 'string' && arguments.length > 1) {
    // Rowset.where(field, value [, return_first] [, async])
    field = arguments[0]
    value = arguments[1]
    if (arguments.length > 2) first = arguments[2]
    if (arguments.length > 3) async = arguments[3]
  }
  console.log(async)

  return new Promise((resolve, reject) => {
    // TODO lots of logic here
    // The new rowset that is returned must be in the same format as the response from the server

    if (first) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].row[field] === value) {
          resolve(new Row(this.relation, { columns: this.columns, result: [ this.rows[i] ] }))
        }
      }
      reject(new Error('could not find ' + field + ' ' + value))
    } else {
      var returnRowset = []
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].row[field] === value) {
          returnRowset.push(this.rows[i])
        }
      }
      resolve(new Rowset(this.relation, { columns: this.columns, result: returnRowset }))
    }

    // 2

    // maybe we don't need to search the entire row and instead we return the first item found
    /*
       var newRowset = _.filter(this.rows, function(el) {
    //return equals.call(this, el[field], val)
    })
    */
    /*
    if (newRowset.length === 1) {
      return new Row(this.relation, newRowset)
    } else if (newRowset.length > 1) {
      throw 'Multiple Rows Returned'
    }
    */
    // if row does not exist
    return null
  })
}

Rowset.prototype.orderBy = function (column, direction) {
  /*
     var ordered = _.sortBy(this.rows, function(el) {
     return el.row[column]
     })
     */
    /*
  if (direction !== 'asc') {
    ordered.reverse()
  }
  return new Rowset(this.relation, { columns: this.columns, result: ordered })
  */
}

Rowset.prototype.limit = function (lim) {
  if (lim <= 0) {
    throw new Error('Bad limit')
  }
  return new Rowset(this.relation, { columns: this.columns, result: this.rows.slice(0, lim) })
}

Rowset.prototype.relatedRows = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schemaName.relationName)')
    // throw 'Related relation name must be schema qualified (schemaName.relationName)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.relation.schema.database

  var values = this.map(row => {
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

Rowset.prototype.relatedRow = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schemaName.relationName)')
    // throw 'Related relation name must be schema qualified (schemaName.relationName)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.relation.schema.database

  var values = this.map(row => {
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
