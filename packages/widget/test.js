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
    const [ , name, , , value ] = match
    attrs[name] = value ? value.trim() : true
    match = attrsRegex.exec(attrList)
  }

  return attrs
}

function parseChildren () {
  return {}
}

/**
 * TODO: sanity checks
 * is there only one root node
 * is every tag closed
 */
function buildTemplateTree (template) {
  template = template.trim()

  if (template[0] !== '<') {
    throw new Error('failed to parse template')
  }

  let state = {
    tagEncountered: false,
    inTag: false,
    node: '',
    textNode: '',
    content: '',
    currentTag: {
      parent: null,
      children: []
    }
  }

  template.split('').forEach(char => {
    if (state.tagEncountered) {
      // Decide what type of tag
      state.tagEncountered = false
      state.inTag = true
      state.node += char
      if (char === '/') {
        state.endTag = true
      } else {
        state.startTag = true
      }
    } else if (char === '<') {
      // Start new tag
      state.tagEncountered = true
      state.node += char

      if (state.textNode.trim() !== '') {
        state.currentTag.children.push({
          type: 'text',
          content: state.textNode,
          parent: state.currentTag
        })
        state.textNode = ''
      }
    } else if (state.inTag) {
      // Build tag node
      state.node += char

      if (char === '>') {
        // End current tag
        state.inTag = false
        if (state.endTag) {
          state.endTag = false
          state.currentTag = state.currentTag.parent
        } else if (state.startTag) {
          state.startTag = false
          if (state.node !== '') {
            const newTag = {
              type: 'tag',
              content: state.node,
              parent: state.currentTag,
              children: []
            }
            state.currentTag.children.push(newTag)
            state.currentTag = newTag
          }
        }
        state.node = ''
      }
    } else {
      // Build text node
      state.textNode += char
    }
  })

  return state.currentTag
}

function parseTemplate (template) {
  if (!template) {
    throw new Error('template not found')
  }

  const tree = buildTemplateTree(template)
  return tree

  const indices = []
  let index = 0
  const ast = {}
  let element = ast
  let match = tagRegex.exec(template)
  while (match !== null) {
    indices[index] = {
      start: match.index,
      end: tagRegex.lastIndex
    }
    if (index > 0) {
      let textContent = template.slice(indices[index-1].end, indices[index].start).trim()
      if (textContent !== '') {
        indices[index].textContent = textContent
      }
    }
    index++

    const [ , tag, attrs ] = match
    element.tag = tag
    element.attrs = parseAttrs(attrs)
    element.children = parseChildren()
    element.renderFn = ''
    element = element.children
    match = tagRegex.exec(template)
  }

  return { ast, indices }
}

const str = `
<template>
  <double-name-tag notFound isFound=true or="id={{id}}" dog ="bark" :bind = "var" meta-if=" more " @click="this.something = 'abc';" @another="this.a=12">
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
