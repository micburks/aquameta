export default function Field( row, name, pk ) {
  this.row = row
  this.column = new AQ.Column(row.relation, name)
  this.is_primary_key = pk
  this.name = name
  this.value = row.get(name)
  this.id = { row_id: this.row.id, column_id: this.column.id }
  this.to_url = function( id_only ) {
    if (this.row.pk_value == null) {
      console.error('You must call a row with "meta_data: true" in order to use the to_url function')
      throw 'Datum.js: Programming Error'
    }
    return id_only ? '/field/' + this.row.relation.schema.name +
      '/' + this.row.relation.name +
      '/' + /*JSON.stringify(this.row.pk_value)*/ this.row.pk_value +
      '/' + this.column.name :
        this.row.relation.schema.database.endpoint.url +
        '/field/' + this.row.relation.schema.name +
        '/' + this.row.relation.name +
        '/' + /*JSON.stringify(this.row.pk_value)*/ this.row.pk_value +
        '/' + this.column.name
  }
}

Field.prototype = {
  get: function() {
    return this.row.get(this.name)
  },
  set: function( value ) {
    this.value = value; return this.row.set(this.name, value)
  },
  update: function() {
    return this.row.update()
  } // TODO: This is wrong
}
