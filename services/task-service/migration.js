const dotenvExt = require('dotenv-extended');
const fs = require('fs');
const path = require('path');
let isLocal = false;

dotenvExt.load({
  path: path.join(process.env.INIT_CWD ?? '.', '.env'),
  defaults: path.join(process.env.INIT_CWD ?? '.', '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});

const type = 'TASK_SERVICE';

// Check if running in a local environment
try {
  if (fs.existsSync('.infolder')) {
    isLocal = true;
  }
} catch (err) {
  console.error('Error while checking for .infolder:', err);
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
  // Determine the migration type based on MYSQL_MIGRATION flag
  const isMySQLMigration = process.env.MYSQL_MIGRATION === 'true';
  const migrationType = isMySQLMigration ? 'mysql' : 'pg'; // Default to 'pg'

  const DBMigrate = require('db-migrate');

  // Load the appropriate .env schema for migration type
  dotenvExt.load({
    schema: path.join('.', 'migrations', '.env.schema'),
    path: path.join(process.env.INIT_CWD, '.env'),
    errorOnMissing: true,
    includeProcessEnv: true,
  });

  // Initialize db-migrate with the correct migration directory and database config path
  const dbmigrate = DBMigrate.getInstance(true, {
    config: path.join(`migrations/${migrationType}`, 'database.json'),
    cwd: path.resolve(process.cwd(), `migrations/${migrationType}`),
  });
  dbmigrate.up();
}

// Check if migration copy is needed and copy migration files accordingly
if (
  process.env.SOURCELOOP_MIGRATION_COPY ||
  process.env[`${type}_MIGRATION_COPY`]
) {
  const isMySQLMigration = process.env.MYSQL_MIGRATION === 'true';
  const migrationType = isMySQLMigration ? 'mysql' : 'pg'; // Default to 'pg'

  copyFolderRecursiveSync(
    path.join('.', 'migrations', migrationType, 'migrations'),
    process.env.INIT_CWD,
  );
}

function copyFileSync(source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
