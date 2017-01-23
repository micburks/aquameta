const path = require('path');
const webpack = require('webpack');

/*
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
    */
module.exports = {
    entry: './endpoint/datum/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'datum.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};
