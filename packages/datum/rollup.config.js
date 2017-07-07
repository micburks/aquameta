import { readFileSync } from 'fs'
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

export default {
  entry: 'src/index.js',
  plugins: [
    eslint(),
    babel()
  ],
  external: [
    'aquameta-query'
  ],
  banner,
  sourceMap: true,
  moduleName: 'datum',
  targets: [
    { dest: pkg.main, format: 'cjs' },
    { dest: pkg.module, format: 'es' }
  ]
}
