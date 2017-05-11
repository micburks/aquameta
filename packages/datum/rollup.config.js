import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: 'dist/build.js',
  moduleName: 'datum',
  plugins: [
    babel(),
    resolve({
      jsnext: true,
      main: true,
      extensions: [ '.js' ]
    })
  ]
}
