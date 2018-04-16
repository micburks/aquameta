import debug from 'debug'
import Router from 'koa-router'
import session from 'koa-session'
import bodyParser from 'koa-bodyparser'
import { client, database, query } from 'aquameta-datum'

const log = debug('datum')

export default function (config) {
  const router = new Router()
  const path = `/${config.url}/${config.version}/*`
  const pathRegex = new RegExp(path)

  async function handleRequest (ctx) {
    //debug('datum', path, req.url)
    ctx.request.url = ctx.request.url.replace(pathRegex, '')
    //debug('datum request', req.url, req.method, req.query, req.body)

    try {
      const result = await query(
        client({ connection: true }),
        database.http(ctx.request)
      )

      // debug(result)
      ctx.status = result.status
      ctx.set('Content-Type', result.mimetype)
      ctx.body = result.response
    } catch (error) {
      debug(error)
      ctx.throw(error)
    }
  }

  // router.use(session({}, router))
  router.use(bodyParser())

  router
    .get(path, handleRequest)
    .post(path, handleRequest)
    .patch(path, handleRequest)
    .delete(path, handleRequest)

  return router
}
