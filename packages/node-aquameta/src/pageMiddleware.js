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
      // TODO: this is all html specific - should check http headers

      if (config.ssr && page.js) {
        try {
          const render = await import(`${sitemapUrl}/${page.name}.js`)
            .then(mod => {
              if (!mod.default) {
                throw new Error(`no default export found in module ${page.name}.js`);
              }
              return mod.default;
            });
          const rendered = await render();
          if (!rendered) {
            // ssr failed
            throw new Error(`ssr failed: url - ${ctx.req.url}`);
          }
          const renderedHTML = `
            <html>
              <head>
                ${page.content}
                ${rendered.headContent}
              </head>
              <body>
                ${rendered.bodyContent}
                <script type="module">
                  ${page.js}
                </script>
              </body>
            </html>
          `;
          return sendResponse(ctx, {
            status: 200,
            mimetype: 'text/html',
            content: renderedHTML,
          })
        } catch (e) {
          console.error(e);
          return sendResponse(ctx, {
            status: result.status,
            mimetype: page.mimetype,
            page,
          })
        }
      } else {
        return sendResponse(ctx, {
          status: result.status,
          mimetype: page.mimetype,
          page,
        })
      }
    } catch (err) {
      console.log('error', err);
      // debug(err)
      // debug('error in endpoint.request query', err)
      return next();
    }
  };
}

function sendResponse(ctx, {status, mimetype, content, page}) {
  ctx.status = status;
  ctx.set('Content-Type', mimetype);
  if (page && !content) {
    ctx.body = `
      <html>
        <head>
          ${page.content}
        </head>
        <body>
          <script type="module">
            ${page.js}
          </script>
        </body>
      </html>
    `;
  } else {
    ctx.body = content;
  }
}
