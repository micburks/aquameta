// Export the functions available in this controller
module.exports = {
    get(req, res, datum) {

        var rows = datum(req).schema('mickey').relation('test_data').rows();
        console.log(rows);
        rows.then(rows => {

            res.send({
                message: 'you sure did get rows from /contact',
                result: 'rows'
            });

        });

    },
    post(req, res, datum) {

        datum(req).schema('mickey').relation('test_data').insert({
            name: 'my new name: ' + Math.floor(Math.random() * 20),
            value: 3
        }).then(insertedRow => {

            res.send({
                message: 'you sure did insert a row to /contact',
                result: 'insertedRow'
            });

        }).catch(err => {
            console.log('error inserting row', err);
        });

    }
};
