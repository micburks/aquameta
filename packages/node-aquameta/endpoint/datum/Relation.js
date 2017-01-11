const Rowset = require('./Rowset');
const Row = require('./Row');

const Relation = function(schema, name) {
    this.schema = schema;
    this.name = name;
    //console.log('Relation', schema.endpoint.connectionForRequest, name);
};
Relation.prototype.toUrl = function() {
    return `/${this.schema.name}/${this.name}/`;
};
Relation.prototype.rows = function( options ) {
    this.schema.endpoint.get(this, options).then(result => {
        return new Rowset(this, result);
    });
};
Relation.prototype.row = function( options ) {
    this.schema.endpoint.get(this, options).then(result => {
        return new Row(this, result);
    });
};
Relation.prototype.insert = function( data, options ) {
    return this.schema.endpoint.post(this, options);/*.then(result => {
        if(!result.length) {
            throw 'no rows inserted';
        }
        if(result.length === 1) {
            return new Row(this, result);
        }
        return new Rowset(this, result);
    });
    */
};

module.exports = Relation;
