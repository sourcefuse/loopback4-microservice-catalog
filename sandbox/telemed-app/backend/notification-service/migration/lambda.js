const DBMigrate = require("db-migrate");

exports.handler = (event, context, callback) => {
  try {
    const dbMigrate = DBMigrate.getInstance(true, {
      config: "./migrations/database.json",
    });

    dbMigrate.up();
  } catch (error) {
    console.error(error);// NOSONAR
    callback(null, {
      message: error?.message || "something went wrong",
    });
  }
  callback(null, {
    message: "Migration started",
  });
};
