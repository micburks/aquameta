import {resolve as dbResolve} from './pnp-db-loader.js'
import {resolve as jspmResolve} from './pnp-jspm-loader.js'

const loaders = [dbResolve, jspmResolve];
const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolver
) {
  let module;
  for (const loader of loaders) {
    const resolvedModule = await loader(
      specifier,
      parentModuleURL,
      defaultResolver
    );
    if (resolvedModule) {
      module = resolvedModule;
      break;
    }
  }

  return module || {
    url: new URL(specifier, parentModuleURL).href,
    format: 'module'
  };
}
