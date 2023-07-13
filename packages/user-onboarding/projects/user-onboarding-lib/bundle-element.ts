const concat = require('concat');
const {ensureDir, readFileSync, writeFileSync} = require('fs-extra');
const {copyFile, rm} = require('fs-extra');


async function elementsBundler() {
  const space = 2;
  const files = [
    
    './dist/user-onboarding-element/runtime.js',
    './dist/user-onboarding-element/polyfills.js',
    './dist/user-onboarding-element/main.js',
  ];
  await ensureDir('./dist/user-onboarding-element/element');
  await concat(files, './dist/user-onboarding-element/element/user-onboarding-element.js');
  
  //copy the package.json and change the name to element
  const packageJsonPath = './package.json';
  const jsonObj = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  jsonObj.name = '@sourceloop/user-onboarding-client';
  delete jsonObj.peerDependencies;
  writeFileSync(packageJsonPath,
    JSON.stringify(jsonObj, null, space),
  );
}

elementsBundler();
