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
// const aquameta = require('aquameta')

/* Optional Configuration */
const endpointConfig = {
  url: '/endpoint',
  version: '0.1'
}

/* Get api with default config */
// let datum = aquameta()

/* Set config */
// let datum = aquameta(endpointConfig)

/* Register data routes by supplying your app */
const datum = aquameta(endpointConfig, app)

/* Pass endpoint into app-specific routes to use */
//require('./server/routes')(app, datum)



/**********************************************************/
/* IN ROUTES: */
/**********************************************************/
/* Server-side API usage */
// datum(req).schema('').table('').rows()

/* Get a role-verified connection */
// datum(req).connect().then().catch()

/* If you want to do something different with server-side notifications */
// endpointConfig = { sockets: false }
// datum(req).connect().then(client => client.on('notification', ()=>{}))



module.exports = app
