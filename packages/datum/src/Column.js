function Column( relation, name ) {
  this.relation = relation
  this.name = name
  this.id = { relation_id: relation.id, name: name }
}

export default Column
