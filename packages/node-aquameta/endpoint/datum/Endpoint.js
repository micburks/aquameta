'use strict';
const Query = require('../Query');

module.exports = function( config ) {

    const query = function( method ) {

        return function( metaId, args, data ) {

            let query = new Query(config);
            query.fromDatum(method, metaId, args, data);
            return query.fetch();

        };
    };

    return {
        get: query('GET'),
        post: query('POST'),
        patch: query('PATCH'),
        delete: query('DELETE')
    };
}();

