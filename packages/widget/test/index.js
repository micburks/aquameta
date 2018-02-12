import { parseTemplate } from './src'

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

const parsed = parseTemplate(str)
console.log(parsed)
