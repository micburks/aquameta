const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/datum/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
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
