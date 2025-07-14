const dotenvExt = require('dotenv-extended');
const fs = require('fs');
const path = require('path');
let isLocal = false;

// Load environment variables
dotenvExt.load({
  path: path.join(process.env.INIT_CWD ?? '.', '.env'),
  defaults: path.join(process.env.INIT_CWD ?? '.', '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});

const type = 'CHAT';
const isMysqlMigration = process.env.MYSQL_MIGRATION === 'true'; // MySQL migration flag

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
  const DBMigrate = require('db-migrate');
  dotenvExt.load({
    schema: path.join('.', 'migrations', '.env.schema'),
    path: path.join(process.env.INIT_CWD, '.env'),
    errorOnMissing: true,
    includeProcessEnv: true,
  });

  // Set migration directory and database config path based on MYSQL_MIGRATION flag
  const migrationDir = isMysqlMigration ? 'mysql' : 'pg';
  const dbmigrate = DBMigrate.getInstance(true, {
    config: path.join('migrations', migrationDir, 'database.json'),
    cwd: path.resolve(process.cwd(), 'migrations', migrationDir),
  });

  dbmigrate.up();
}

// Copy migration files if COPY flag is set
if (
  process.env.SOURCELOOP_MIGRATION_COPY ||
  process.env[`${type}_MIGRATION_COPY`]
) {
  const migrationDir = isMysqlMigration ? 'mysql' : 'pg';
  copyFolderRecursiveSync(
    path.join('.', 'migrations', migrationDir, 'migrations'),
    process.env.INIT_CWD,
  );
}

// Utility functions for copying files and folders
function copyFileSync(source, target) {
  let targetFile = target;
  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
