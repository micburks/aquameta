import chalk from 'chalk'
import ramda from 'ramda'

const heavy = true
const checkmark = heavy ? '\u2714' : '\u2713'
const X = heavy ? '\u2718' : '\u2717'
const O = '\u25CF'

const { blue, green, red } = chalk
const { curry } = ramda

export function describe (desc, fn) {
  const log = { jobs: {}, default: [ blue(desc) ] }

  const checkJobs = () => {
    if (itJobs === 0) {
      const jobs = Object.keys(log.jobs).map(id => log.jobs[id])

      console.log(
        log.default.concat(...jobs).join('\n')
      )
    } else {
      setImmediate(checkJobs)
    }
  }

  setImmediate(checkJobs)

  return {
    it: it(log),
    xit: xit(log)
  }
}

let itJobs = 0
const xit = curry((log, desc) => log.default.push(` ${blue(O)} ${desc}`))
const it = log => async (...args) => {
  itJobs++

  if (args.length < 2) {
    throw new Error('test utils: invalid call to `it`')
  }

  const id = args.slice(0, -2).join(' - ')
  const desc = args[args.length - 2]
  const fn = args[args.length - 1]

  let logRef = log.default
  if (id) {
    log.jobs[id] = log.jobs[id] || [ ` ${blue(id)}` ]
    logRef = log.jobs[id]
  }

  try {
    await fn()
    logRef.push(` ${green(checkmark)} ${desc}`)
  } catch (e) {
    logRef.push(` ${red(X)} ${desc} \n    ${e.message}`)
  }

  itJobs--
}
