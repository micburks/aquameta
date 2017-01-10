const Endpoint = require('../Endpoint');
const Row = require('./Row');
const Rowset = require('./Rowset');
const Request = require('../Request');

const Relation = function(schema, name) {
    this.schema = schema;
    this.name = name;
    //console.log('Relation', schema.endpoint.connectionForRequest, name);
};
Relation.prototype.rows = function( options ) {
    this.schema.endpoint.request('GET', this.schema.name, this.name, options).then(result => {
        return new Rowset(this, result);
    });
};
Relation.prototype.row = function( options ) {
    this.schema.endpoint.request('GET', this.schema.name, this.name, options).then(result => {
        return new Row(this, result);
    });
};
Relation.prototype.insert = function( options ) {
    this.schema.endpoint.request('POST', this.schema.name, this.name, options).then(result => {
        if(!result.length) {
            throw 'no rows inserted';
        }
        if(result.length === 1) {
            return new Row(this, result);
        }
        return new Rowset(this, result);
    });
};

module.exports = Relation;
