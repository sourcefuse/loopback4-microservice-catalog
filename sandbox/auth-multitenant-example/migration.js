const dotenv = require('dotenv');
const fs = require('fs');
const DBMigrate = require('db-migrate');
const path = require('path');
let isLocal = false;
dotenv.config({path: `${process.env.INIT_CWD}/.env`});

try {
  if (fs.existsSync('.infolder')) {
    isLocal = true;
  }
} catch (err) {
  console.info('\n');
}
if (isLocal) {
  console.info(`Skipping migrations`);
} else {
  const dbmigrate = DBMigrate.getInstance(true, {
    config: './migrations/database.json',
  });
  dbmigrate.up();
}
