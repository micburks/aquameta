'use strict'
//const aquameta = require('node-aquameta')
const aquameta = require('./src/index.js')
const express = require('express')
const logger = require('morgan')

const app = express()

app.use(logger('dev'))
app.set('views', './views')


/* Client-side usage */
// aquameta.schema('').table('').rows()


/* Server-side usage */
/**********************************************************/
/* Optional Configuration */
const endpointConfig = {
  url: '/endpoint',
  version: 'v0.1'
}

/* Register data routes */
const datum = aquameta.routes(endpointConfig, app)

/* Pass endpoint into app-specific routes to use */
//require('./server/routes')(app, datum)

/* Use in routes */
// datum(request).schema('').table('').rows()
/**********************************************************/

/* If you want a role-verified node-postgres connection */
// const db = aquameta.connect(request).then().catch()

/* If you want to do something different with server-side notifications */
// endpointConfig = { sockets: false }
// aquameta.connect.then(client => client.on('notification'))


module.exports = app
