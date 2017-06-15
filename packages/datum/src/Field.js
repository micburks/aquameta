import Column from './Column'

export default function Field (row, name, pk) {
  this.row = row
  this.column = new Column(row.relation, name)
  this.isPrimaryKey = pk
  this.name = name
  this.value = row.get(name)
  this.id = { row_id: this.row.id, column_id: this.column.id }
  this.toUrl = function (idOnly) {
    if (this.row.pk_value == null) {
      console.error('You must call a row with "meta_data: true" in order to use the to_url function')
      throw new Error('Datum.js: Programming Error')
    }
    return idOnly ? '/field/' + this.row.relation.schema.name +
      '/' + this.row.relation.name +
      '/' + /* JSON.stringify(this.row.pk_value) */ this.row.pk_value +
      '/' + this.column.name
        : this.row.relation.schema.database.endpoint.url +
        '/field/' + this.row.relation.schema.name +
        '/' + this.row.relation.name +
        '/' + /* JSON.stringify(this.row.pk_value) */ this.row.pk_value +
        '/' + this.column.name
  }
}

Field.prototype = {
  get () {
    return this.row.get(this.name)
  },
  set (value) {
    this.value = value; return this.row.set(this.name, value)
  },
  update () {
    return this.row.update()
  } // TODO: This is wrong
}
