const assert = require('assert')

const startTagRegex = /\<([\w-]+)(.*)\>/g
const endTagRegex = /\<\/([\w-]+)\>/g
const attrsRegex = /([\w:@-]+)(\s*=\s*(['"]?)(.+?)\3)?(?:\s)/g
const conditionRegex = /\{\{(.+?)\}\}/g

function parseAttrs (attrList) {
  // Use artificial space at the end of the line for RegExp sake
  attrList = `${attrList.trim()} `

  const attrs = {}
  let match = attrsRegex.exec(attrList)
  while (match !== null) {
    const [ , name, , , value ] = match
    attrs[name] = value ? value.trim() : true
    match = attrsRegex.exec(attrList)
  }

  return attrs
}

function buildTemplateTree (template) {
  template = template.trim()

  if (template[0] !== '<') {
    throw new Error('template parse error: template must begin with a tag')
  }

  let state = {
    tagEncountered: false,
    textNode: '',
    content: '',
    currentTag: {
      parent: null,
      children: []
    }
  }

  for (let index = 0; index < template.length; index++) {
    const char = template[index]

    if (state.tagEncountered) {
      state.tagEncountered = false

      // Decide what type of tag
      if (char === '/') {
        // Deal with end tag
        startTagRegex.lastIndex = index - 1
        const match = endTagRegex.exec(template)
        const [ , tagName ] = match

        if (tagName !== state.currentTag.name) {
          throw new Error('template parse error: mismatched tag in template')
        }

        state.currentTag.closed = true
        state.currentTag = state.currentTag.parent

        // Continue reading template at the end of the regex match
        index = endTagRegex.lastIndex
      } else {
        // Deal with start tag
        startTagRegex.lastIndex = index - 1
        const match = startTagRegex.exec(template)

        const newTag = {
          type: 'tag',
          name: match[1],
          attrs: match[2],
          attrMap: parseAttrs(match[2]),
          tag: match[0],
          parent: state.currentTag,
          children: [],
          renderFn: '?'
        }
        state.currentTag.children.push(newTag)
        state.currentTag = newTag

        // Continue reading template at the end of the regex match
        index = startTagRegex.lastIndex
      }
    } else if (char === '<') {
      // Start new tag
      state.tagEncountered = true

      // Add current text node to currentTag
      if (state.textNode.trim() !== '') {
        state.currentTag.children.push({
          type: 'text',
          content: state.textNode,
          parent: state.currentTag
        })
      }

      state.textNode = ''
    } else {
      // Build text node
      state.textNode += char
    }
  }

  return state.currentTag
}

function parseTemplate (template) {
  if (!template) {
    throw new Error('template not found')
  }

  const tree = buildTemplateTree(template)

  if (tree.children.length !== 1) {
    throw new Error('template parse error: templates cannot contain multiple root elements')
  }

  if (tree.children[0].name !== 'template') {
    throw new Error('template parse error: root tag must be a `template`')
  }

  return tree
}

const str = `
<template>
  <double-name-tag notFound isFound=true or="id={{id}}" dog ="bark" :bind = "var" meta-if=" more > 3 " @click="this.something = 'abc';" @another="this.a=12">
    <div meta-if="hideDiv">
      {{again}}
      <span>
        {{here}}
      </span>
    </div>
    {{ secondChild }}
  </double-name-tag>
</template>
`

const parsed = parseTemplate(str)
console.log(parsed)
