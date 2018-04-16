const aquameta = require('./src/index.js')
const express = require('express')
const app = express()

/**********************************************************/
/* SERVER-SIDE USAGE: */
/**********************************************************/
const aquameta = require('aquameta')

const endpointConfig = {
  url: '/endpoint',
  version: '0.1',
  node: true
}

// Add Aquameta middleware and routes to the app
app.use(aquameta(endpointConfig))
