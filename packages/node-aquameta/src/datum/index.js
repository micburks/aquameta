const Endpoint = require('./Endpoint');
const Schema = require('./Schema');

const config = {
    url: '/endpoint',
    version: 'v1'
};

const datum = {
    schema: name => new Schema(Endpoint(config), name)
};

module.exports = datum;
