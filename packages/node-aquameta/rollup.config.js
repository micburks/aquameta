import { readFileSync } from 'fs'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

export default {
  entry: 'src/index.js',
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    eslint(),
    babel()
  ],
  external: [
    'aquameta-query',
    'pg'
  ],
  banner,
  sourceMap: true,
  moduleName: 'aquameta',
  targets: [
    { dest: pkg.main, format: 'cjs' },
    { dest: pkg.module, format: 'es' }
  ]
}
