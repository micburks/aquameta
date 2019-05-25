const path = require('path');

const config = {
  mode: 'development',
  entry: './src/datum-entry.js',
  output: {
    // library: 'datum',
    // libraryTarget: 'umd',
    // libraryExport: 'default',
  },
};

module.exports = [{
  ...config,
  target: 'node',
  output: {
    ...config.output,
    filename: 'lib.node.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'aquameta-datum': path.resolve(
        __dirname,
        'node_modules/aquameta-datum',
        'dist-node-esm/index.js'
      ),
    },
  },
}, {
  ...config,
  target: 'web',
  output: {
    ...config.output,
    filename: 'lib.browser.js',
    libraryTarget: 'umd',
  },
  resolve: {
    alias: {
      'aquameta-datum': path.resolve(
        __dirname,
        'node_modules/aquameta-datum',
        'dist-browser-esm/index.js'
      ),
    },
  },
}];
