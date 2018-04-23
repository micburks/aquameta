import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'

export default {
  input: 'src/widget.js',
  plugins: [
    globals(),
    builtins(),
    commonjs({
      include: 'node_modules/**',
    }),
    resolve()
  ],
  output: {
    file: 'dist/build.js',
    format: 'umd',
    name: 'widget',
  }
}
