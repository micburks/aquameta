const Query = require('./Query');
const Connection = require('./Connection');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/*
const application = (env, start_response) => {
    request = Request(env)

    try:
        with map_errors_to_http(), cursor_for_request(request) as cursor:

            # We want to maintain escaped urls as string data
            full_path = re.split('\?', env['REQUEST_URI'])[0]       # get rid of query params
            path_with_version = full_path.replace('/endpoint/', '', 1) # get rid of endpoint path
            version, path = path_with_version.split('/', 1)

            logging.info('handling request for: %s' % env['REQUEST_URI'])
            logging.debug('attempting endpoint %s, %s, %s, query %s, post %s' % (version, request.method, path, request.args, request.data))

            cursor.execute('''
                select status, message, response, mimetype
                from endpoint.request(%s, %s, %s, %s::json, %s::json)
            ''', (
                version,                                                # version - 0.1, 0.2, etc...
                request.method,                                         # verb - GET | POST | PATCH | PUT | DELETE ...
                path,                                                   # path - the relative path including leading slash but without query string
                json.dumps(request.args.to_dict(flat=False)),           # args - "url parameters", aka parsed out query string, converted to a json string
                request.get_data() if request.data else 'null'
            ))

            row = cursor.fetchone()

            if row.mimetype.startswith('image'): # There is a better way here.
                return Response(
                    response=a2b_base64(row.response),
                    content_type=row.mimetype,
                    status=row.status
                )

            # TODO?
            # How come status and message are not used here?
            return Response(
                response=row.response,
                content_type=row.mimetype,
                status=row.status
            )

    except HTTPException as e:
        e_resp = e.get_response()

        if(request.mimetype == 'application/json'):
            response = Response(
                response=json.dumps({
                    "title": "Bad Request",
                    "status_code": e_resp.status_code,
                    "message": e.description
                }),
                status=e_resp.status_code,
                mimetype="application/json"
            )

            return response

        else:
            return e
};
*/

module.exports = (app, config) => {
    /*
     * starts with /endpoint
     * go through auth middleware
     * return endpoint.request
     */

    /*
    could just run endpoint.shcmea('endpoint').function('request', {})
    and be done
    would have to duplicate some of the same error checking with status code and
    pull result and mimetype out of json object
    */

    /*
    everythign starting with /endpiont comes here
    take url, query string, data and pass them into queryOptions parser
    establish connection to database
    run query with queryOptions
    return json or whatever
    */

    const router = express.Router();
    const connect = Connection().connect;
    const path = new RegExp(`^${config.url}/${config.version}`);

    function handleRequest(req, res) {
        console.log('datum request', req.url, req.method, req.query, req.body);
        /*
         * Next TODO: move query logic into queryOptions or Query
        let query = new Query(req.method, req.url, req.query, req.body);
        return query.run(connect(req));
        */
    }

    router.use(cookieParser());
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.route(path)
        .get(handleRequest)
        .post(handleRequest)
        .patch(handleRequest)
        .delete(handleRequest);

    app.use(router);

};


