const Endpoint = require('./Endpoint');
const Schema = require('./Schema');

module.exports = ( app, config ) => {

    const datum = {
        schema: name => new Schema(new Endpoint(), name)
    };

    return datum;

};

