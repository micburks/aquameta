import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'

const external = require('repl')._builtinLibs.concat([
  'isomorphic-fetch'
])

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/build.js',
  moduleName: 'widget',
  external,
  plugins: [
    nodeResolve(),
    babel()
  ]
}
