import {ensureDir} from 'fs-extra';
import {copyFile, rm} from 'fs/promises';
const concat = require('concat');

async function elementsBundler() {
  const files = [
    './dist/search-element/runtime.js',
    './dist/search-element/polyfills.js',
    './dist/search-element/main.js',
  ];
  await ensureDir('./dist/element');
  await concat(files, './dist/element/search-element.js');
  await copyFile(
    './dist/search-element/styles.css',
    './dist/element/styles.css',
  );
  await rm('./dist/search-element', {recursive: true});
}

elementsBundler();
