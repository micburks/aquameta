const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const debug = require('debug')('Datum')
const express = require('express')
const Query = require('./Query')
const Connection = require('./Connection')

module.exports = function( app, config ) {

  /* Datum */

  const router = express.Router()
  const path = new RegExp(`^${config.url}/${config.version}/`)

  function handleRequest(req, res) {

    req.url = req.url.replace(path, '')
    debug('datum request', req.url, req.method, req.query, req.body)

    const connect = Connection(req).connect
    const query = new Query(config)
    query.fromRequest(req)
    query.execute(connect())
      .then(result => {

        debug(result)

        // TODO these things are not available as of right now
        //res.status(result.status);
        //res.set(result.mimetype);
        res.set('Content-Type', 'application/json');

        res.send(result)

        /*
                return Response(
                    response=row.response,
                    content_type=row.mimetype,
                    status=row.status
                )
                */
      })
      .catch(error => {
        debug(error)
        res.send(error)
      })

  }


  // TODO this should not be required
  // Write without express
  /* REQUIRED if using Server-Side API */
  /*
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  */

  router.use(cookieParser())
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))

  router.route(path)
    .get(handleRequest)
    .post(handleRequest)
    .patch(handleRequest)
    .delete(handleRequest)

  app.use(router)

}


