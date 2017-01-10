const pg = require('pg');
const Request = require('./Request');

const anonConfig = {
    /* user: 'anonymous', */
    user: 'mickey',
    database: 'aquameta',
    /* password: 'lkjd', */
    host: 'localhost',
    port: 5432,
    max: 4,
    idleTimeoutMillis: 30000
};

/*
var pool = new pg.Pool(config);
pool.connect(callback);
// is the same as
pg.connect(config, callback);
// and this way, pg will keep track of the pools and not create a new one when
// the same config has been passed in twice
*/

const verifySession = function( req ) {

    return pg.connect(anonConfig)
        .then(client => {
            return client.query('select (role_id).name as role_name from endpoint.session where id = $1::uuid', [ req.cookies.session_id ]);
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

}

const request = function( method, schema, dbObject, options ) {
    return new Request(arguments);
}

// will have to do anon query to find current user with session_id, then switch
// role name for next query
module.exports = {
    connectionForRequest(request) {

        // TODO This is an Auth check - should it be here?
        return verifySession(request);
    },
    request
};


