'use strict';
const pg = require('pg');
const QueryOptions = require('./QueryOptions');

const anonConfig = {
    /*
    user: 'anonymous',
    password: null,
    */
    user: 'mickey',
    password: 'secret',
    database: 'aquameta',
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
            return client.query(
                    'select (role_id).name as role_name from endpoint.session where id = $1::uuid',
                    [ req.cookies.session_id ])

                /* TODO these clients still need to be closed. SEE BELOW */
                .then(result => (client.release(), result));
                .then(error => (client.release(), throw error));
        })
        .then(result => {
            console.log('result is : ', result.row.length, result.row);

            let userConfig = Object.assign({}, anonConfig, { user: result.row.role_name });
            console.log('configs', userConfig, anonConfig);

            return pg.connect(userConfig);
        })
        .catch(err => {
            /* Problem logging in */
            console.log('error is : ', err);
            return pg.connect(anonConfig);
        });

        /* TODO close clients e.g. */
		/*
         * this way would only work if we passed in a callback, instead of
         * using promises
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

// will have to do anon query to find current user with session_id, then switch
// role name for next query

/*
query('select status, message, response, mimetype from endpoint.request($1, $2, $3, $4::json, $5::json)', [ version, request.method, path, json.dumps(request.args.to_dict(flat=False)), request.get_data() if request.data else 'null' ])

return Response(
    response=row.response,
    content_type=row.mimetype,
    status=row.status
)
*/


module.exports = function( request ) {

    const config = {
        url: process.env.url || '/endpoint',
        version: process.env.version || '/v1',
        request: request
    };

    const query = function( method ) {

        return function( metaId, args, data ) {
            //console.log('function returned from query', config, method);

            let queryOptions = new QueryOptions(args);

            return verifySession(config.request)
                .then(client => {
                    return client.query(
                        'select status, message, response, mimetype ' +
                        'from endpoint.request($1, $2, $3, $4::json, $5::json)', [
                            config.version,
                            method,
                            metaId.toUrl(),
                            JSON.stringify(queryOptions.options),
                            JSON.stringify(data)
                        ])
                    .then(res => {
                        client.release();
                        console.log('endpiont.request', res);
                        return res;
                    })
                    .catch(err => {
                        client.release();
                        console.log('error in endpoint.request query');
                    });
                })
        };

    };

    return {
        get: query('GET'),
        post: query('POST'),
        patch: query('PATCH'),
        delete: query('DELETE')
    };

};

