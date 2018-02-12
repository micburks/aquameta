import resolve from 'rollup-plugin-node-resolve'

const external = require('repl')._builtinLibs

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/build.js',
  moduleName: 'widget',
  external,
  plugins: [
    resolve({
      jsnext: true,
      main: true
    })
  ]
}
