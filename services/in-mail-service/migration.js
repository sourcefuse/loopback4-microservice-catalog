const dotenv = require('dotenv');
const dotenvExt = require('dotenv-extended');
const fs = require('fs');
const DBMigrate = require('db-migrate');
const path = require('path');
let isLocal = false;
dotenv.config({path: path.join(process.env.INIT_CWD, '.env')});

try {
  if (fs.existsSync('.infolder')) {
    isLocal = true;
  }
} catch (err) {
  console.info('\n');
}

if (
  isLocal ||
  process.env.INMAIL_MIGRATION_SKIP ||
  process.env.SOURCELOOP_MIGRATION_SKIP
) {
  console.info(`Skipping migrations`);
} else {
  dotenvExt.load({
    schema: path.join(`.`, `migrations`, `.env.schema`),
    path: path.join(process.env.INIT_CWD, '.env'),
    errorOnMissing: true,
    includeProcessEnv: true,
  });
  const dbmigrate = DBMigrate.getInstance(true);
  dbmigrate.up();
}

if (
  process.env.SOURCELOOP_MIGRATION_COPY ||
  process.env.INMAIL_MIGRATION_COPY
) {
  copyFileSync(path.join('.', 'database.json'), process.env.INIT_CWD);
  copyFolderRecursiveSync(path.join('.', '/migrations'), process.env.INIT_CWD);
}

function copyFileSync(source, target) {
  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
