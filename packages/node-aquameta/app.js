const aquameta = require('./src/index.js')
const express = require('express')
const logger = require('morgan')
const app = express()
app.use(logger('dev'))

/**********************************************************/
/* CLIENT-SIDE USAGE: */
/**********************************************************/
// import datum from 'aquameta-datum'
// datum.schema('').table('').rows()

/**********************************************************/
/* SERVER-SIDE USAGE: */
/**********************************************************/
/* Include this in your project */
const aquameta = require('aquameta')

/* Optional Configuration */
const endpointConfig = {
  url: '/endpoint',
  version: '0.1'
}

// Register data routes by supplying your app
const endpoint = aquameta(app, endpointConfig)

// If some application bootstrapping is necessary
endpoint.schema('my_app').relation('config').row('name', 'bootstrap.json')
  .then(performApplicationBootstrapping)

// Register application routes
require('./server/routes')(app)

/**********************************************************/
/* IN ROUTES: */
/**********************************************************/
/* Server-side API usage */
// request.endpoint(req).schema('').table('').rows()

/* Get a role-verified connection */
// request.endpoint(req).connect().then().catch()

/* If you want to do something different with server-side notifications */
// endpointConfig = { sockets: false }
// request.endpoint(req).connect().then(client => client.on('notification', ()=>{}))

module.exports = app
