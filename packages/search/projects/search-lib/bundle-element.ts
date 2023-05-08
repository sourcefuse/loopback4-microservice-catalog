import {ensureDir, readFileSync, writeFileSync} from 'fs-extra';
import {copyFile, rm} from 'fs/promises';
import * as crypto from 'crypto';
const concat = require('concat');

async function elementsBundler() {
  const space = 2;
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

  // generate the hash of element file to keep a track of the chnages
  // whenever any changes are made in the element the corresponding js file will
  // resulting in changing its hash, so the element will also be published

  const file = '../search-element/dist/search-element.js';

  try {
    const data = readFileSync(file);
    const hash = crypto.createHash('sha256');
    hash.update(data);

    const fileHash = hash.digest('hex');
    //update the package.json with the new hashCode
    //if there will be changes in hash then the element will also be published
    const packageJsonPath = '../search-element/package.json';
    const jsonObj = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    jsonObj.hash = fileHash;
    writeFileSync(packageJsonPath, JSON.stringify(jsonObj, null, space));
  } catch (err: any) {
    console.error(`An error occurred while reading ${file}: ${err.message}`);
  }
}

elementsBundler();