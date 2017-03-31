const ctrls = require('../controllers');

// Export a single function that attaches routes to the application
// Associate routes with controllers
module.exports = (app, datum) => {
    // Contact
    app.get('/client/contact', (req, res) => res.render('client.contact.pug'));

    //app.get('/server/contact', (req, res) => res.render('server.contact.pug'));
    app.get('/server/contact', (req, res) => ctrls.contact.get(req, res, datum));
    app.post('/server/contact', (req, res) => ctrls.contact.post(req, res, datum));

};

