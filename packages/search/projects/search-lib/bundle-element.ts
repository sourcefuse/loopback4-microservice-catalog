import {ensureDir, readFileSync, writeFileSync} from 'fs-extra';
import {copyFile, rm} from 'fs/promises';
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
  await ensureDir('../search-element');
  await concat(files, '../search-element/search-element.js');
  await copyFile(
    './dist/search-element/styles.css',
    '../search-element/styles.css',
  );
  await rm('./dist/search-element', {recursive: true});
}

elementsBundler();
