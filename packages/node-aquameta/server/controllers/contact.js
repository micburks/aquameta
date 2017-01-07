// Export the functions available in this controller
module.exports = {
    post(req, res, dbConn) {
        /*
        endpoint.schema('mickey').table('contact').insert({
        }).then(function(contact) {
        }).catch(function(err) {
        });
        */
        res.send({
            message: 'you sure did post to /contact',
            dbConn
        })
    }
};
