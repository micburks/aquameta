import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import https from 'https';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const dir = path.dirname(new URL(import.meta.url).pathname);
const cacheDir = path.join(dir, '.aquameta_cache');
const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;
const fullUrlRegex = /^https\:\/\/.*/;
const relativeRegex = /^\/npm\:/;

function encode(str) {
  return str.replace(/[/?]/g, char => {
    return `[${char.charCodeAt(0)}]`;
  });
}
function decode(str) {
  return str.replace(/\[(\d+)\]/g, (_, code) => {
    return String.fromCharCode(code);
  });
}

function getRequestFromCachePath(path) {
  const [, relative] = path.split(cacheDir);
  const decoded = decode(relative);
  return decoded.replace('/dev.jspm.io', '');
}

function getUrlCachePath(url) {
  const urlCachePath = path.join(cacheDir, encode(url));
  return urlCachePath;
}

async function writeToCache(url, module) {
  await mkdir(path.dirname(url), {recursive: true});
  await writeFile(url, module);
}

async function httpsGet(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      let response = '';
      res.on('data', d => {
        response += d;
      });
      res.on('end', () => {
        resolve(response);
      });
    });
  });
}

export async function resolve(
  specifier,
  parentModuleURL = baseURL,
  defaultResolver
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
  const isRelativePath = /^\./.test(specifier);
  if (isRelativePath) {
    const relativeParentPath = getRequestFromCachePath(parentModuleURL);
    console.log(isRelativePath, specifier, relativeParentPath)
    if (
      fullUrlRegex.test(relativeParentPath) ||
      relativeRegex.test(relativeParentPath)
    ) {
      specifier = path.join(path.dirname(relativeParentPath), specifier);
      console.log(specifier, relativeParentPath)
    }
  }
  const isFullUrl = fullUrlRegex.test(specifier);
  const isRelativeUrl = relativeRegex.test(specifier);
  if (isFullUrl || isRelativeUrl) {
    const absoluteUrl = isRelativeUrl ? `https://dev.jspm.io${specifier}` : specifier;
    const urlCachePath = getUrlCachePath(absoluteUrl.replace(/^https\:\/\//, ''));
    url = new URL(urlCachePath, parentModuleURL).href;
    const exists = await fs.existsSync(urlCachePath);
    if (!exists) {
      const result = await httpsGet(absoluteUrl);
      await writeToCache(urlCachePath, result);
    }
    console.log('url', url);
    return {url, format: 'module'};
  } else {
    return false;
  }
}
