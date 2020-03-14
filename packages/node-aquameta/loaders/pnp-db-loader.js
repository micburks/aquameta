import fs from 'fs';
import path from 'path';
import datum from 'aquameta-datum';
import {promisify} from 'util';

// TODO: do this with streams for performance

const {client, database: db, query} = datum;
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const dir = new URL(`file://${process.cwd()}`).pathname;
const cacheDir = path.join(dir, '.loader_cache');
const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;

function getUrlCachePath(url) {
  const urlCachePath = path.join(cacheDir, url);
  return urlCachePath;
}

async function writeToCache(url, module) {
  await mkdir(path.dirname(url), {recursive: true});
  await writeFile(url, module);
}

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolver,
) {
  // does async not work at all for loading a file?
  // - try to make a minimal reproduction to test it out
  // try to stream writing
  // try to remove existsSync
  //
  // or i need to preprocess
  // or do a dynamic import entry point for a module that async loads the tne
  // entire dep tree
  let url = new URL(specifier, parentModuleURL).href;
  const dbRegex = /^\/db\/.+\/.+\/.+\.js/;
  if (dbRegex.test(specifier)) {
    const urlCachePath = getUrlCachePath(specifier);
    url = new URL(urlCachePath, parentModuleURL).href;
    const exists = await fs.existsSync(urlCachePath);
    if (!exists) {
      const [module] = await query(
        client.connection(),
        db.http({url: specifier}),
      );
      await writeToCache(urlCachePath, module.response);
    }
    return {url, format: 'module'};
  } else {
    return false;
  }
}
