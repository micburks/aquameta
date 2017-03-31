const Column = function( relation, name ) {
  this.relation = relation
  this.name = name
  this.id = { relation_id: relation.id, name: name }
}
module.exports = Column
