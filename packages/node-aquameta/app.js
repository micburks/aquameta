'use strict';
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Set up the express app
const app = express();
app.use(cookieParser());

// Endpoint setup
const endpoint = require('./endpoint')(app);

// Log request to the console
app.use(logger('dev'));
app.set('views', './views');

// Parse incoming requests data (github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
require('./server/routes')(app, endpoint);

module.exports = app;

