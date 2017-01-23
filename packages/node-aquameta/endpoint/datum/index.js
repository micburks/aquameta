const Endpoint = require('./Endpoint');
const Schema = require('./Schema');

const datum = {
    schema: name => new Schema(Endpoint, name)
};

window.datum = datum;

/*
module.exports = ( app, config ) => {

    const datum = {
        schema: name => new Schema(new Endpoint(), name)
    };

    return datum;

};
*/
