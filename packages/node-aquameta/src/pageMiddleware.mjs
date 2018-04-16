import debug from 'debug'
import { client, database, query } from 'aquameta-datum'

const log = debug('datumMiddleware')
/**

create view endpoint.sitemap as
select r.path, m.mimetype, r.content
from endpoint.resource r
  join endpoint.mimetype m on m.id=r.mimetype_id;

*/
export default function (config) {
  return async (ctx, next) => {
    if (ctx.req.method !== 'GET') return

    try {
      const result = await query(
        client(config),
        database.select(
          database.where('path', ctx.req.url)(
            database.relation('endpoint.sitemap')
          )
        )
      )

      const response = JSON.parse(result.response)

      if (response.length === 0) {
        console.log('no page')
        // debug('page not found')
        return next()
      }

      const page = response.result[0].row

      ctx.status = result.status
      ctx.set('Content-Type', page.mimetype)
      ctx.body = page.content
    } catch (err) {
      console.log('error', err)
      // debug(err)
      // debug('error in endpoint.request query', err)
      next()
    }
  }
}
