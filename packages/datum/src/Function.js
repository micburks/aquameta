export default function Function (schema, name, args) {
  this.schema = schema
  this.name = name

  if(args instanceof Array) {
    this.args = '{' + args.join(',') + '}'
  } else {
    this.args = args
  }

  this.id = { schema_id: this.schema.id, name: this.name, args: this.args }
  this.to_url = function (id_only) {
    var base_url = id_only ? '' : this.schema.database.endpoint.url
    if (typeof this.args != 'undefined') {
      return base_url + '/function/' + this.schema.name + '/' + this.name + '/' + this.args
    }
    return base_url + '/function/' + this.schema.name + '/' + this.name
  }
}
