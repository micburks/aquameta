import chalk from 'chalk'
import ramda from 'ramda'

const heavy = true
const checkmark = heavy ? '\u2714' : '\u2713'
const X = heavy ? '\u2718' : '\u2717'
const O = '\u25CF'

const { blue, green, red } = chalk
const { curry } = ramda

export function describe (desc, fn) {
  const log = [ blue(desc) ]

  setImmediate(() => {
    console.log(log.join('\n'))
  })

  return {
    it: it(log),
    xit: xit(log)
  }
}

const it = curry(async (log, desc, fn) => {
  try {
    await fn()
    log.push(` ${green(checkmark)} ${desc}`)
  } catch (e) {
    log.push(` ${red(X)} ${desc} \n    ${e.message}`)
  }
})

const xit = curry((log, desc, fn) => {
  log.push(` ${blue(O)} ${desc}`)
})
