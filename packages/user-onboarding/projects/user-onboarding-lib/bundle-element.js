const concat = require('concat');
const {rm, copyFile} = require('fs/promises');
const {ensureDir, readFileSync, writeFileSync} = require('fs-extra');
const crypto = require('crypto');

async function elementsBundler() {
  const space = 2;
  const files = [
    './dist/user-onboarding-element/runtime.js',
    './dist/user-onboarding-element/polyfills.js',
    './dist/user-onboarding-element/main.js',
  ];
  //await ensureDir('./dist/element');
  await ensureDir('../user-onboarding-element/dist');
  await concat(
    files,
    '../user-onboarding-element/dist/user-onboarding-element.js',
  );

  await copyFile(
    './dist/README.md',
    '../user-onboarding-element/dist/README.md',
  );

  await rm('./dist/user-onboarding-element', {recursive: true});

  // generate the hash of element file to keep a track of the chnages
  // whenever any changes are made in the element the corresponding js file will
  // resulting in changing its hash, so the element will also be published

  const file = '../user-onboarding-element/dist/user-onboarding-element.js';
  const data = readFileSync(file);
  const hash = crypto.createHash('sha256');
  hash.update(data);

  const fileHash = hash.digest('hex');

  //update the package.json with the new hashCode
  //if there will be changes in hash then the element will also be published
  const packageJsonPath = '../user-onboarding-element/package.json';
  const jsonObj = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  jsonObj.hash = fileHash;
  writeFileSync(packageJsonPath, JSON.stringify(jsonObj, null, space));
}

elementsBundler();
