const dotenvExt = require('dotenv-extended');
const fs = require('fs');
const path = require('path');
let isLocal = false;
dotenvExt.load({
  path: path.join(process.env.INIT_CWD, '.env'),
  defaults: path.join(process.env.INIT_CWD, '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});
const type = 'NOTIF';

try {
  if (fs.existsSync('.infolder')) {
    isLocal = true;
  }
} catch (err) {
  console.info('\n');
}
if (isLocal) {
  console.info(`Skipping migrations`);
} else if (
  !(process.env[`${type}_MIGRATION`] || process.env.SOURCELOOP_MIGRATION)
) {
  console.warn(
    `${type}_MIGRATION or SOURCELOOP_MIGRATION variables not found in the environment, skipping automigration.`,
  );
} else {
  const DBMigrate = require('db-migrate');
  dotenvExt.load({
    schema: path.join('.', 'migrations', '.env.schema'),
    path: path.join(process.env.INIT_CWD, '.env'),
    errorOnMissing: true,
    includeProcessEnv: true,
  });
  const dbmigrate = DBMigrate.getInstance(true);
  dbmigrate.up();
}

if (
  process.env.SOURCELOOP_MIGRATION_COPY ||
  process.env[`${type}_MIGRATION_COPY`]
) {
  copyFolderRecursiveSync(path.join('.', 'migrations'), process.env.INIT_CWD);
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
