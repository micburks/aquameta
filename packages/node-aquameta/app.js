'use strict';
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const endpoint = require('./endpoint');
endpoint.my_next_value = 15555;

console.log(endpoint);

// Set up the express app
const app = express();

// Log request to the console
app.use(logger('dev'));
app.set('views', './views');

// Parse incoming requests data (github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let dbPools = {
    one: 1, two: 2
};
// Routes
require('./server/routes')(app, dbPools);

module.exports = app;

