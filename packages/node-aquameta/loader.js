import {resolve as dbResolve} from './loaders/pnp-db-loader.js';
import {resolve as jspmResolve} from './loaders/pnp-jspm-loader.js';

const loaders = [dbResolve, jspmResolve];
const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;
const relativeRegex = /^\.{0,2}[/]/;

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolver,
) {
  let module;
  for (const loader of loaders) {
    const resolvedModule = await loader(
      specifier,
      parentModuleURL,
      defaultResolver,
    );
    if (resolvedModule) {
      module = resolvedModule;
      break;
    }
  }

  if (module) {
    return module;
  }

  if (!relativeRegex.test(specifier)) {
    // node_module
    return defaultResolver(specifier, parentModuleURL);
  } else {
    // relative file
    return {
      url: new URL(specifier, parentModuleURL).href,
      format: 'module',
    };
  }
}
