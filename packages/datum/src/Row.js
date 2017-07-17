import Field from './Field'

export default function Row (relation, query) {
  const response = query.response
  this.relation = relation
  this.schema = relation.schema
  this.rowData = response.result[0].row

  this._fields = {}
  this.columns = response.columns || null
  this.pkColumnName = null
  this.pkValue = null
  this.id = null
  this.toUrl = function () {
    console.error('You must call a row with "metaData: true" in order to use the toUrl function')
    throw new Error('Datum.js: Programming Error')
  }

  if (typeof response.pk !== 'undefined') {
    this.pkColumnName = response.pk
    this.pkValue = this.get(this.pkColumnName)
    // this.id = {"pk_column_id":{"relation_id":{"schema_id":{"name":this.schema.name},"name":this.relation.name},"name":this.pk_column_name},"pk_value": this.pk_value}
    this.id = {
      pk_column_id: {
        relation_id: this.relation.id,
        name: this.pkColumnName
      },
      pk_value: this.pkValue
    }

    this.toUrl = function (idOnly) {
      return idOnly ? '/row/' + this.relation.schema.name + '/' + this.relation.name + '/' + /* JSON.stringify(this.pk_value) */ this.pkValue
        : this.relation.schema.database.endpoint.url + '/row/' + this.relation.schema.name + '/' + this.relation.name + '/' + /* JSON.stringify(this.pkValue) */ this.pkValue
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
  get (name) {
    return this.rowData[name]
  },
  set (name, value) {
    this.rowData[name] = value; return this
  },
  toString () {
    return JSON.stringify(this.rowData)
  },
  clone () {
    return new Row(this.relation, { columns: this.columns, pk: this.pkColumnName, result: [{ row: this.rowData }] })
  },
  field (name) {
    if (!(name in this._fields[name])) {
      this._fields[name] = new Field(this, name, name === this.pkColumnName)
    }
    return this._fields[name]
  },
  fields () {
    if (this.columns !== null) {
      return this.columns.map(c => {
        return this.field(c.name)
      })
    }
    return null
  }
}

Row.prototype.update = function () {
  return this.relation.schema.database.endpoint.patch(this, this.rowData)
    .then(response => {
      if (response === null) {
        throw new Error('Empty response')
      }
      return this
    }).catch(err => {
      throw new Error('Update failed: ' + err)
    })
}

Row.prototype.delete = function () {
  return this.relation.schema.database.endpoint.delete(this)
    .then(response => {
      if (response === null) {
        throw new Error('Empty response')
      }
      return true
    }).catch(err => {
      throw new Error('Delete failed: ' + err)
    })
}

Row.prototype.relatedRows = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schema_name.relation_name)')
    // throw 'Related relation name must be schema qualified (schema_name.relation_name)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.relation.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where === 'undefined' ? [] : [options.where])
  options.where.push({
    name: relatedColumnName,
    op: '=',
    value: this.get(selfColumnName)
  })

  return db.schema(schemaName).relation(relationName).rows(options)
}

Row.prototype.relatedRow = function (selfColumnName, relatedRelationName, relatedColumnName, options) {
  var relationParts = relatedRelationName.split('.')
  if (relationParts.length < 2) {
    console.error('Related relation name must be schema qualified (schema_name.relation_name)')
    // throw 'Related relation name must be schema qualified (schema_name.relation_name)'
  }

  var schemaName = relationParts[0]
  var relationName = relationParts[1]
  var db = this.relation.schema.database

  options = options || {}
  options.where = options.where instanceof Array ? options.where : (typeof options.where === 'undefined' ? [] : [options.where])
  options.where.push({
    name: relatedColumnName,
    op: '=',
    value: this.get(selfColumnName)
  })

  return db.schema(schemaName).relation(relationName).row(options)
}
