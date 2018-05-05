const fs = require('fs')
const path = require('path')

module.exports = {
  '/endpoint/*/relation/widget/render': path.resolve(__dirname, './render.json'),
  '/endpoint/*/relation/widget/event': path.resolve(__dirname, './event.json')
}
