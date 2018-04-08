import url from 'url'
import path from 'path'
import process from 'process'

const ramda = path.join(process.cwd(), 'node_modules/ramda/es/index.js')

export function resolve (specifier, parentModuleURL, defaultResolve) {
  if (specifier === 'ramda') {
    // Resolve ramda to es version
    return {
      url: new url.URL(ramda, parentModuleURL).href,
      format: 'esm'
    }
  } else if (/ramda\/es\//.test(parentModuleURL)) {
    // Change format to esm for ramda modules
    return {
      ...defaultResolve(specifier, parentModuleURL, defaultResolve),
      format: 'esm'
    }
  } else {
    // Default
    return defaultResolve(specifier, parentModuleURL, defaultResolve)
  }
}
