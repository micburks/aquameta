const assert = require('assert')

const tagRegex = /\<([\w-]+)(.*)\>/g
const attrsRegex = /([\w:@-]+)(\s*=\s*(['"]?)(.+?)\3)?(?:\s)/g
const conditionRegex = /\{\{(.+?)\}\}/g

function parseAttrs (attrList) {
  // Use artificial space at the end of the line for RegExp sake
  attrList = `${attrList.trim()} `

  const attrs = {}
  let match = attrsRegex.exec(attrList)
  while (match !== null) {
    console.log(attrsRegex.lastIndex, attrList.length)
    const [ , name, , , value ] = match
    attrs[name] = value ? value.trim() : true
    match = attrsRegex.exec(attrList)
  }

  return attrs
}

function parseChildren () {
  return {}
}

function parseTemplate (template) {
  const ast = {}
  let element = ast
  let match = tagRegex.exec(template)
  while (match !== null) {
    const [ , tag, attrs ] = match
    element.tag = tag
    element.attrs = parseAttrs(attrs)
    element.children = parseChildren()
    element.renderFn = ''
    element = element.children
    match = tagRegex.exec(template)
  }

  return { ast }
}

const str = `
<template>
  <double-name-tag notFound isFound=true or="id={{id}}" dog ="bark" :bind = "var" meta-if=" more " @click="this.something = 'abc';" @another="this.a=12">
    <div meta-if="hideDiv">
      <span>
        {{here}}
      </span>
    </div>
    {{ secondChild }}
  </double-name-tag>
</template>
`

const { ast } = parseTemplate(str)
// console.log(JSON.stringify(ast, null, 2))
console.log(ast)
