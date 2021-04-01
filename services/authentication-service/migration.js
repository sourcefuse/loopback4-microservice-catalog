const childProcess = require('child_process');
const dotenv = require('dotenv');
const dotenvExt = require('dotenv-extended');
const fs = require('fs');
const DBMigrate = require('db-migrate');
let isLocal = false;
try {
  if (fs.existsSync('.infolder')) {
    isLocal = true;
  }
} catch (err) {
  console.info('\n');
}
if (isLocal) {
  console.info(`Skipping "postinstall" script on local installs`);
} else {
  dotenv.config();
  dotenvExt.load({
    schema: `./migrations/.env.schema`,
    path: `${process.env.INIT_CWD}/.env`,
    errorOnMissing: true,
    includeProcessEnv: true,
  });
  const dbmigrate = DBMigrate.getInstance(true);
  dbmigrate.up();
}
