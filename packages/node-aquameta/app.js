'use strict';
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Set up the express app
const app = express();
// TODO dont need both, I dont think
app.use(cookieParser());


// session
let sess = {
    secret: 'keyboard cat',
    cookie: {},
    resave: false,
    saveUninitialized: true
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess))


// Client-side usage
/**********************************************************/
// Optional Configuration
const endpointConfig = {
    url: '/endpoint',
    version: 'v1'
};
// Register data routes
const datum = require('./endpoint')(app, endpointConfig);
/**********************************************************/


// Log request to the console
app.use(logger('dev'));
app.set('views', './views');

// Parse incoming requests data (github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Server-side usage
/**********************************************************/
// Pass endpoint into app-specific routes to use
require('./server/routes')(app, datum);
/**********************************************************/


module.exports = app;

