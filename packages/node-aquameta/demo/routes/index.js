const ctrls = require('../controllers')

module.exports = (app, datum) => {
  app.get('/client/contact', (req, res) => res.render('client.contact.pug'))
  app.get('/server/contact', (req, res) => ctrls.contact.get(req, res, datum))
  app.post('/server/contact', (req, res) => ctrls.contact.post(req, res, datum))
}

