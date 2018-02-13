const external = require('repl')._builtinLibs.concat('aquameta-datum')

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/build.js',
  moduleName: 'widget',
  external
}
