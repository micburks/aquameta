const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/datum-entry.js',
  output: {
    library: 'datum',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
};
