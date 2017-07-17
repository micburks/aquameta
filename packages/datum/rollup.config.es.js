import { readFileSync } from 'fs'
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

export default {
  entry: 'src/index.js',
  format: 'es',
  dest: pkg.module,
  plugins: [
    babel(),
    eslint()
  ],
  external: [
    'aquameta-query'
  ],
  banner,
  sourceMap: true
}
