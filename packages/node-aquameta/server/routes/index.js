const ctrls = require('../controllers');

// Export a single function that attaches routes to the application
// Associate routes with controllers
module.exports = (app, dbPools) => {
    // console.log(app);
    // Contact
    app.get('/contact', (req, res) => res.render('contact.pug'));
    app.post('/contact', (req, res) => ctrls.contact.post(req, res, dbPools));

};

