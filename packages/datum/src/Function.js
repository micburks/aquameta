export default function Function (schema, name, args) {
  this.schema = schema
  this.name = name

  if (args instanceof Array) {
    this.args = '{' + args.join(',') + '}'
  } else {
    this.args = args
  }

  this.id = { schema_id: this.schema.id, name: this.name, args: this.args }
  this.toUrl = function (idOnly) {
    var baseUrl = idOnly ? '' : this.schema.database.endpoint.url
    if (typeof this.args !== 'undefined') {
      return baseUrl + '/function/' + this.schema.name + '/' + this.name + '/' + this.args
    }
    return baseUrl + '/function/' + this.schema.name + '/' + this.name
  }
}
