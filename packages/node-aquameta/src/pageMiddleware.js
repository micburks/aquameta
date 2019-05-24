// import debug from 'debug';
import {client, database, query} from 'aquameta-datum';
import {compose} from 'ramda';

// const log = debug('datumMiddleware');
const sitemapUrl = '/db/endpoint/sitemap';
const sitemap = database.relation('endpoint.sitemap');

export default function(config) {
  const dbClient = client.connection(config.client);
  const executeQuery = compose(
    query(dbClient),
    database.select,
  );
  return async (ctx, next) => {
    if (ctx.req.method !== 'GET' || ctx.body) {
      // Skip if body already set
      return next();
    }

    try {
      const result = await executeQuery(
        database.where('path', ctx.req.url, sitemap),
      );
      const response = JSON.parse(result.response);

      if (
        !response ||
        !response.result ||
        response.result.length === 0
      ) {
        console.log('no page');
        // debug('page not found')
        ctx.status = 404;
        return next();
      }

      const page = response.result[0].row;

      if (config.ssr && page.js) {
        const {default: render} = await import(
          `${sitemapUrl}/${page.name}.js`
        );
        const rendered = await render();
        ctx.status = result.status;
        ctx.set('Content-Type', page.mimetype);
        ctx.body = page.content + rendered;
      } else {
        ctx.status = result.status;
        ctx.set('Content-Type', page.mimetype);
        ctx.body = page.content;
      }
    } catch (err) {
      console.log('error', err);
      // debug(err)
      // debug('error in endpoint.request query', err)
      return next();
    }
  };
}
