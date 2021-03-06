// import debug from 'debug';
import Router from 'koa-router';
// import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import {client, database, query} from 'aquameta-datum';
import {compose} from 'ramda';

// const log = debug('datum');

export default function(config) {
  const dbClient = client.connection(config.client);
  const router = new Router();
  const path = `/${config.client.url}/${config.client.version}/*`;
  const pathRegex = new RegExp(`/${config.client.url}/`);
  const sourceRegex = /\/db\/.+\/.+\/.+\..+/;
  const sourcePath = '/db/:schemaName/:relationName/:name.:column';
  const executeHTTPQuery = compose(query(dbClient), database.http);

  async function handleRequest(ctx, next) {
    //debug('datum', path, req.url)
    const isSource = sourceRegex.test(ctx.request.url);

    const url = isSource
      ? ctx.request.url
      : ctx.request.url.replace(pathRegex, '');
    //debug('datum request', req.url, req.method, req.query, req.body)

    try {
      const result = await executeHTTPQuery({
        url,
        body: ctx.request.body,
        method: ctx.request.method,
      });

      // debug(result)
      if (isSource) {
        const response = (await result.json()).result;
        if (response.length > 0) {
          const source = response[0].row;
          ctx.status = source.status;
          ctx.set('Content-Type', source.mimetype);
          ctx.body = source.response;
        }
      } else {
        ctx.status = result.status;
        ctx.set('Content-Type', result.mimetype);
        ctx.body = result.response;
      }
    } catch (error) {
      // debug(error);
      ctx.throw(error);
    }

    return next();
  }

  // router.use(session({}, router))
  router.use(bodyParser());

  router
    .get(sourcePath, handleRequest)
    .get(path, handleRequest)
    .post(path, handleRequest)
    .patch(path, handleRequest)
    .delete(path, handleRequest);

  return router;
}
