// import debug from 'debug';
import Router from 'koa-router';
// import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import {client, database, query} from 'aquameta-datum';
import {compose} from 'ramda';

// const log = debug('datum');

export default function(config) {
  const dbClient = client.connection(config);
  const router = new Router();
  const path = `/${config.url}/${config.version}/*`;
  const pathRegex = new RegExp(`/${config.url}/`);
  const sourceRegex = /\/db\/.+\/.+\/.+\..+/;
  const sourcePath = '/db/:schemaName/:relationName/:name.:column';
  const executeHTTPQuery = compose(
    query(dbClient),
    database.http,
  );

  async function handleRequest(ctx, next) {
    //debug('datum', path, req.url)
    console.log(ctx.request.url);

    const url = sourceRegex.test(ctx.request.url)
      ? ctx.request.url
      : ctx.request.url.replace(pathRegex, '');
    //debug('datum request', req.url, req.method, req.query, req.body)

    try {
      const result = await executeHTTPQuery({...ctx.request, url});

      // debug(result)
      ctx.status = result.status;
      ctx.set('Content-Type', result.mimetype);
      ctx.body = result.response;
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
