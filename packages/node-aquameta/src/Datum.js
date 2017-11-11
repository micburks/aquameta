import Connection from 'aquameta-connection'
import Query from 'aquameta-query'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import log from 'debug'
import express from 'express'

const debug = log('Datum')

export default function (config, app) {
  const router = express.Router()
  const path = new RegExp(`^${config.url}/${config.version}/`)

  function handleRequest (req, res) {
    // is this necessary since its a router with its own path
    req.url = req.url.replace(path, '')
    debug('datum request', req.url, req.method, req.query, req.body)

    const connect = new Connection(config, req).connect
    const query = new Query(config)
    query.fromRequest(req)
    query.execute(connect())
      .then(result => {
        debug(result)
        res.status(result.status)
        res.set('Content-Type', result.mimetype)
        res.send(result.response)
      })
      .catch(error => {
        debug(error)
        res.send(error)
      })
  }

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
