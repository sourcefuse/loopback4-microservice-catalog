import {join} from 'path';
import {copyFile} from 'fs/promises';
import {ensureDir} from 'fs-extra';
async function buildElement() {
  const files = ['./search-element.js', './styles.css', './package.json'];
  const target = 'dist';

  await ensureDir('dist');

  files.forEach(async file => {
    const targetPath = join(target, file);
    await copyFile(file, targetPath);
  });
}

buildElement();
