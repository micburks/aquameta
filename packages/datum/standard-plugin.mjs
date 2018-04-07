import standard from 'standard'
import SnazzyStream from 'snazzy'
import { createFilter } from 'rollup-pluginutils'

export default function (options = {}) {
  const msgs = {}
  const filter = createFilter(options.include, options.exclude || /node_modules/)

  return {
    name: 'standard',
    outro () {
      const snazzy = new SnazzyStream()
      snazzy.pipe(process.stdout)

      for (var id in msgs) {
        msgs[id].forEach(msg => snazzy.write(msg))
      }

      snazzy.end()
    },
    transform (code, id) {
      if (!msgs[id]) msgs[id] = []
      msgs[id].splice(0)

      if (!filter(id)) return null

      const lintResults = standard.lintTextSync(code)

      if (!lintResults.warningCount && !lintResults.errorCount) return

      lintResults.results.forEach(result => {
        if (!result.messages || !result.messages.length) return

        result.messages.forEach(message => {
          msgs[id].push(`  ${id}:${message.line}:${message.column}: ${message.message} (${message.ruleId})\n`)
        })
      })
    }
  }
}
