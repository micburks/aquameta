const QueryOptions = require('../QueryOptions');

module.exports = function() {

    const config = {
        url: '/endpoint/',
        version: '/v1/'
    };

    const query = function( method ) {

        // TODO combine args and data
        return ( metaId, args, data ) => {

            let queryOptions = new QueryOptions(args);
            // args = args || {};

            let baseUrl = `/${config.url}/${config.version}`.replace(/\/+/g, '/');
            console.log(baseUrl);

            // URLs
            let idUrl = metaId.toUrl();//true); // ID part of the URL only
            let urlWithoutQuery = baseUrl + idUrl;
            let urlWithQuery = urlWithoutQuery + queryOptions.queryString.replace(/^\?*/, '?');

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
    };

    return {
        get: query('GET'),
        post: query('POST'),
        patch: query('PATCH'),
        delete: query('DELETE')
    };
}();

