const Relation = require('./Relation');
const Function = require('./Function');

const Schema = function( endpoint, name ) {
    this.endpoint = endpoint;
};
Schema.prototype.relation = function( name ) { return new Relation(this, name); };
Schema.prototype.function = function( name, options ) { return new Function(this, name, options); };

module.exports = Schema;
