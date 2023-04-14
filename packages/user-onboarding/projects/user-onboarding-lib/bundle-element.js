const concat = require('concat');
const {rm} = require('fs/promises');
const {ensureDir, readFileSync, writeFileSync} = require('fs-extra');

async function elementsBundler() {
  const space = 2;
  const files = [
    './dist/user-onboarding-element/runtime.js',
    './dist/user-onboarding-element/polyfills.js',
    './dist/user-onboarding-element/main.js',
  ];
  await ensureDir('./dist/element');
  await concat(files, './dist/element/user-onboarding-element.js');

  await rm('./dist/user-onboarding-element', {recursive: true});

  //copy the package.json and change the name to element
  const packageJsonPath = './package.json';
  const jsonObj = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  jsonObj.name = '@sourceloop/user-onboarding-element';
  delete jsonObj.peerDependencies;
  writeFileSync(
    './dist/element/package.json',
    JSON.stringify(jsonObj, null, space),
  );
}

elementsBundler();
