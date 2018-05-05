import { readFileSync } from 'fs'
import resolve from 'rollup-plugin-node-resolve'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

const external = [
  'pg',
  'ramda',
  'whatwg-fetch'
]

export default [{
  input: 'src/server-index.mjs',
  external,
  output: {
    banner,
    file: pkg.main,
    format: 'cjs',
    name: 'datum'
  }
}, {
  input: 'src/server-index.mjs',
  external,
  output: {
    banner,
    file: pkg.module,
    format: 'es'
  }
}, {
  input: 'src/browser-index.mjs',
  plugins: [
    resolve({ only: ['ramda'] })
  ],
  output: {
    banner,
    file: pkg.browser,
    format: 'es',
    name: 'datum'
  }
}]
