import { readFileSync } from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

export default {
  entry: 'src/index.js',
  format: 'iife',
  dest: pkg.browser,
  moduleName: 'datum',
  plugins: [
    uglify({
      output: {
        comments (node, comment) {
          const { value } = comment
          return /aquameta-datum/i.test(value)
        }
      }
    }),
    commonjs(),
    nodeResolve({
      browser: true
    }),
    babel()
    eslint()
  ],
  banner,
  sourceMap: true
}
