const pg = require('pg');
const QueryOptions = require('./QueryOptions');

const anonConfig = {
    // user: 'anonymous',
    user: 'mickey',
    database: 'aquameta',
    /* password: 'lkjd', */
    host: 'localhost',
    port: 5432,
    max: 4,
    idleTimeoutMillis: 30000
};

/* TODO I want to keep track of how many pools are open and when they connect
 * pg-pool has some great events
 * pool.on('connect', client => {
 *   client.count = count++
 * })
 */

/*
var pool = new pg.Pool(config);
pool.connect(callback);
// is the same as
pg.connect(config, callback);
// and this way, pg will keep track of the pools and not create a new one when
// the same config has been passed in twice
*/

const verifySession = function( req ) {

    // If req.session.user is logged in, return pg.connect(userConfig) without
    // looking at endpoint.session

/*
        // Auth session
        let auth_session_id = req.cookies.sessionId;


        let currentSessionCookie =  req.cookies.sessionId;
        if (this.authSessionId != currentSessioncookie) {
            // session has changed
            // update auth_session_id
            this.authSessionId = currentSessionCookie;
            // dump cache
            this.cache = {};
        }
        */

    return pg.connect(anonConfig)
        .then(client => {
            return client.query('select (role_id).name as role_name from endpoint.session where id = $1::uuid', [ req.cookies.session_id ]);
            /* TODO these clients still need to be closed. SEE BELOW */
        })
        .then(result => {
            let userConfig = anonConfig;
            userConfig.user = result.row.role_name;
            console.log('configs', userConfig, anonConfig);
            return pg.connect(userConfig);
        })
        .catch(err => {
            /* Problem logging in */
            return pg.connect(anonConfig);
        });

        /* TODO close clients e.g. */
		/*
		pool
			.connect()
			.then(client => {
				return client
					.query('SELECT $1::int AS "clientCount"', [client.count])
					.then(res => console.log(res.rows[0].clientCount)) // outputs 0
					.then(() => client)
			})
			.then(client => client.release())
		*/

}

const query = function( method, config ) {

    // TODO combine args and data
    return ( metaId, args, data ) => {

        return verifySession(config.request);
/*
query('select status, message, response, mimetype from endpoint.request($1, $2, $3, $4::json, $5::json)', [ version, request.method, path, json.dumps(request.args.to_dict(flat=False)), request.get_data() if request.data else 'null' ])

return Response(
    response=row.response,
    content_type=row.mimetype,
    status=row.status
)
*/
    };
        /*
        let queryOptions = new QueryOptions(args);
        // args = args || {};

        let baseUrl = `/${config.url}/${config.version}`.replace(/\/\//g, '/');
        console.log(baseUrl);

        // URLs
        let idUrl = metaId.toUrl();//true); // ID part of the URL only
        let urlWithoutQuery = baseUrl + idUrl;
        let urlWithQuery = urlWithoutQuery + queryOptions.queryString;

        // If query string is too long, upgrade GET method to POST
        if(method === 'GET' && (location.host + urlWithQuery).length > 1000) {
            method = 'POST';
        }

        // This makes the uWSGI server send back json errors
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // Settings object to send with 'fetch' method
        var initObject = {
            method: method,
            headers: headers,
            credentials: 'same-origin'
        };

        // Don't add data on GET requests
        if (method !== 'GET') {
            initObject.body = JSON.stringify(data);
        }

        return fetch(method === 'GET' ? urlWithQuery : urlWithoutQuery, initObject).then(response => {

            // JSON was returned from WebSocket
            if (typeof response.json === 'undefined') {
                // TODO: ? Unfortunately this has no HTTP status like the result of fetch
                //console.log('i am the response', response);
                return response;
            }

            // Request object was returned from fetch

            // Read json stream
            var json = response.json();

            if (response.status >= 200 && response.status < 300) {
                return json;
            }

            // If bad request (code 300 or higher), reject promise
            return json.then(Promise.reject.bind(Promise));

        }).catch(error => {

            // Log error in collapsed group
            console.groupCollapsed(method, error.statusCode, error.title);
            // console.error(url_without_query);
            if ('message' in error) {
                console.error(error.message);
            }
            console.groupEnd();
            throw error.title;

        });
    }
    */
};

// will have to do anon query to find current user with session_id, then switch
// role name for next query
module.exports = function( request ) {

    const config = {
        url: process.env.url,
        version: process.env.version,
        request: request
    };

    // TODO if query was defined in this block, we wouldn't have to pass in the
    // config every time

    return {
        get: query('GET', config),
        post: query('POST', config),
        patch: query('PATCH', config),
        delete: query('DELETE', config)
    };
};

