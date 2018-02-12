const startTagRegex = /\<([\w-]+)(.*?)(\/)?\>/g
const endTagRegex = /\<\/([\w-]+)\>/g
const commentRegex = /\<\!\-\-.*\-\-\>/g
const attrsRegex = /([\w:@-]+)(\s*=\s*(['"]?)(.+?)\3)?(?:\s)/g
const conditionRegex = /\{\{(.+?)\}\}/g

function parseAttrs (attrList) {
  const attrs = {}

  // Use artificial space at the end of the line for RegExp sake
  attrList = `${attrList.trim()} `
  let match = attrsRegex.exec(attrList)
  while (match !== null) {
    const [ , name, , , value ] = match
    attrs[name] = value ? value.trim() : true
    match = attrsRegex.exec(attrList)
  }

  return attrs
}

/**
 * TODO implicit self-closing tags
 */
function buildTemplateTree (template) {
  template = template.replace(commentRegex, '')
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
        endTagRegex.lastIndex = index - 1
        const [ , tagName ] = endTagRegex.exec(template)

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
          renderFn: '?',
          closed: match[3] === '/'
        }
        state.currentTag.children.push(newTag)

        if (!newTag.closed) {
          state.currentTag = newTag
        }

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

export function parseTemplate (template) {
  if (!template) {
    throw new Error('template parse error: template not found')
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
