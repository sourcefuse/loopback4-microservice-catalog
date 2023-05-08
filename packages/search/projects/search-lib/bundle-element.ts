import {ensureDir} from 'fs-extra';
import {copyFile, readFile, rm, writeFile} from 'fs/promises';
const concat = require('concat');

async function elementsBundler() {
  const files = [
    './dist/search-element/runtime.js',
    './dist/search-element/polyfills.js',
    './dist/search-element/main.js',
  ];
  //copy the element related js and css file to separate project
  //so that it can be published individually
  //and then delete it from library
  await ensureDir('./dist/search-element-dist');
  await concat(files, './dist/search-element-dist/search-element.js');
  await copyFile(
    './dist/search-element/styles.css',
    './dist/search-element-dist/styles.css',
  );
  const packageJson = await readFile('./dist/search-lib/package.json', {
    encoding: 'utf-8',
  }).then(json => JSON.parse(json));
  // delete packageJson.scripts;
  delete packageJson.devDependencies;
  delete packageJson.peerDependencies;
  delete packageJson.dependencies;
  delete packageJson.module;
  delete packageJson.es2020;
  delete packageJson.esm2020;
  delete packageJson.fesm2020;
  delete packageJson.fesm2015;
  delete packageJson.typings;
  delete packageJson.exports;
  delete packageJson.sideEffects;
  packageJson.main = './search-element.js';
  packageJson.name = '@search/search-element';
  await writeFile(
    './dist/search-element-dist/package.json',
    JSON.stringify(packageJson, null, 2),
  );
  await rm('./dist/search-element', {recursive: true});
}

elementsBundler();
