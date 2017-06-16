import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import eslint from 'rollup-plugin-eslint'
const pkg = require('./package.json')

export default {
  entry: 'src/index.js',
  targets: [
    { dest: pkg.main, format: 'cjs' },
    { dest: pkg.module, format: 'es' }
  ],
  plugins: [
    eslint(),
    resolve({
      main: true,
      jsnext: true,
      extensions: [ '.js' ]
    }),
    babel()
  ]
}
