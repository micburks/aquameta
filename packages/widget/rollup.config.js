import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/widget.js',
  plugins: [
    babel(),
    globals(),
    builtins(),
    resolve({
      browser: true,
      only: ['ramda', 'aquameta-datum', 'scope-css', 'dot', 'parse5']
    }),
    commonjs({
      include: 'node_modules/**',
    })
  ],
  output: {
    file: 'dist/build.js',
    format: 'es'
  }
}
