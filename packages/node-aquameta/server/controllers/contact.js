// Export the functions available in this controller
module.exports = {
    get(req, res, endpoint) {
        /*
        endpoint.schema('meta').relation('column').rows.then(rows => {
        });
        */
    },
    post(req, res, endpoint) {
        /*
        endpoint.schema('meta').relation('column').insert().then(insertedRow => {
            res.send({
                message: 'you sure did insert a row to /contact',
                result: insertedRow
            });
        }).catch(err => {
            console.err('error inserting row', err);
        });
        */
        endpoint.connectionForRequest(req).then(client => {

            return client.query('select $1::int as number', ['1']).then(result => {

                client.release();

                res.send({
                    message: 'you sure did post to /contact',
                    result: result.rows
                });

            }).catch(err => {
                console.error('error running query', err);
            });
        });

    }
};
