import config from './rollup.config.js'
const pkg = require('./package.json')

config.format = 'umd'
config.dest = 'dist/datum.browser.js'

export default config
