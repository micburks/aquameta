import {promises as __fs} from 'fs';
import __path from 'path';
import __util from 'util';
import __readline from 'readline';

const args = [];
const options = {};
let __cursor = null;
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('-')) {
    __cursor = arg.replace(/^--?/, '');
    options[__cursor] = true;
  } else if (__cursor) {
    options[__cursor] = arg;
    __cursor = null;
  } else {
    args.push(arg);
  }
}

export {args, options};

export async function readDirVerbose(path) {
  const contents = await __fs.readDir(path, {withFileTypes: true});
  return contents.map(file => ({
    name: file.name,
    type: file.isDirectory() ? 'dir' : 'file',
  }));
}

export async function prompt(question) {
  const rl = __readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(`${question} [Y/n]`, answer => {
      const response = answer === '' || answer.toLowerCase() === 'y';
      rl.close();
      resolve(response);
    });
  });
}

export async function recursiveRemove(dirPath) {
  const distFiles = await readDirVerbose(dirPath);
  if (distFiles) {
    await Promise.all(
      distFiles.map(file => {
        if (file.type === 'dir') {
          return recursiveRemove(__path.join(dirPath, file.name));
        } else {
          return __fs.unlink(__path.join(dirPath, file.name));
        }
      }),
    );
    await __fs.rmdir(dirPath);
  }
}
