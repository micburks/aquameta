import { readFileSync } from 'fs'
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const banner = readFileSync('./banner.js', 'utf-8')
  .replace('${version}', pkg.version)

export default [{
    input: 'src/index.js',
    output: {
      banner,
      file: pkg.main,
      format: 'umd',
      name: 'datum'
    }
  }, {
    input: 'src/index.js',
    output: {
      banner,
      file: pkg.module,
      format: 'es'
    }
  }
]
