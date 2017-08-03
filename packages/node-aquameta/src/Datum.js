const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const debug = require('debug')('Datum')
const express = require('express')
const Query = require('aquameta-query')
const Connection = require('./Connection')

module.exports = function( config, app ) {

  /* Datum */
  const router = express.Router()
  const path = new RegExp(`^${config.url}/${config.version}/`)

  function handleRequest(req, res) {

    // is this necessary since its a router with its own path
    req.url = req.url.replace(path, '')
    debug('datum request', req.url, req.method, req.query, req.body)

    const connect = Connection(config, req).connect
    const query = new Query(config)
    query.fromRequest(req)
    query.execute(connect())
      .then(result => {

        debug(result)

        res.status(result.status);
        res.set('Content-Type', result.mimetype);

        res.send(result.response)

      })
      .catch(error => {
        debug(error)
        res.send(error)
      })

  }

  // TODO this should not be required
  // Write without express
  /* REQUIRED if using Server-Side API */
  router.use(cookieParser())
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))

  router.route(path)
    .get(handleRequest)
    .post(handleRequest)
    .patch(handleRequest)
    .delete(handleRequest)

  return router
}
