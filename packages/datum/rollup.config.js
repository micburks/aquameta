import { readFileSync } from 'fs'
import standard from './standard-plugin.mjs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

export default [{
  input: 'src/server-index.mjs',
  plugins: [
    standard()
  ],
  output: {
    banner,
    file: pkg.main,
    format: 'umd',
    name: 'datum'
  }
}, {
  input: 'src/server-index.mjs',
  plugins: [
    standard()
  ],
  output: {
    banner,
    file: pkg.module,
    format: 'es'
  }
}]
