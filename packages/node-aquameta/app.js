'use strict'
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.use(logger('dev'))
app.set('views', './views')


/* Client-side usage */
/**********************************************************/
/* Optional Configuration */
const endpointConfig = {
    url: '/endpoint',
    version: 'v1',
    sessionCookie: 'SESSION_ID'
}

/* Register data routes */
const datum = require('./endpoint')(app, endpointConfig)
/**********************************************************/


/* REQUIRED if using Server-Side API */
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/* Server-side usage */
/**********************************************************/
/* Pass endpoint into app-specific routes to use */
require('./server/routes')(app, datum)
/**********************************************************/


module.exports = app

