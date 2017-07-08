export function getOrCreate (key, cache, factory) {
  if (!(key in cache)) {
    cache[key] = factory ? factory() : {}
  }
  return cache[key]
}

export function curry (fn) {
  const len = fn.length
  const cb = (...args) => {
    return args.length >= len ? fn(...args) : cb.bind(null, ...args)
  }
  return cb
}

export function compose (...fns) {
  if (fns.length < 2) {
    return fns[0]
  }
  if (fns.length === 2) {
    return compose2(fns[0], fns[1])
  }
  return compose(compose2(fns[0], fns[1]), ...fns.slice(2))
}

function compose2 (fnA, fnB) {
  return function (x) {
    return fnA(fnB(x))
  }
}

export function flip (fn) {
  return function (a, b) {
    const args = Array.from(arguments)
    args[0] = b
    args[1] = a
    return fn(...args)
  }
}
