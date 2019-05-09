const assert = require('assert')
const { parseTemplate } = require('../dist/build.js')

const str = `
<!--
  This is a comment

-->
<template>
  <double-name-tag notFound isFound=true or="id={{id}}" dog ="bark" :bind = "var" meta-if=" more > 3 " @click="this.something = 'abc';" @another="this.a=12">
    <div meta-if="hideDiv">
      {{again}}
      <!-- another comment -->
      <span>
        <br/>
        {{here}}
      </span>
    </div>
    {{ secondChild }}
  </double-name-tag>
  <input type='text' />
</template>
`

describe('parseTemplate', () => {
  it('works', () => {
    const parsed = parseTemplate(str)
    assert(true)
  })
})
