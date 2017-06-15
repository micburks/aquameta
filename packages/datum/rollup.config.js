import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import eslint from 'rollup-plugin-eslint'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/build.js',
  moduleName: 'datum',
  plugins: [
    eslint(),
    resolve({
      jsnext: true,
      main: true,
      extensions: [ '.js' ]
    }),
    babel(),
    uglify()
  ]
}
