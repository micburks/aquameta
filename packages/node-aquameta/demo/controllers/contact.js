// Export the functions available in this controller
module.exports = {
  get (req, res, datum) {
    datum(req).schema('mickey').relation('test_data').rows().then(rows => {
      res.render('server.contact.pug', { rows })
    }).catch(err => {
      console.log('error selecting all rows', err)
      res.render('server.contact.pug', { err })
    })
  },
  post (req, res, datum) {
    datum(req).schema('mickey').relation('test_data').insert({
      name: 'my new name: ' + Math.floor(Math.random() * 20),
      value: 3
    }).then(insertedRow => {
      res.send({
        message: 'you sure did insert a row to /contact',
        result: 'insertedRow'
      })
    }).catch(err => {
      console.log('error inserting row', err);
      res.send({
        message: 'error'
      })
    })
  }
}
