'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;

function handleData(resolve, reject, filePath) {
  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (err) return reject(err);
    console.log('received data: ' + data);

    resolve(data);
  });
}

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function (db) {
  var filePath = path.join(__dirname, 'sqls', '20210416135254-init-up.sql');
  return new Promise(function (resolve, reject) {
    handleData(resolve, reject, filePath);
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports.down = function (db) {
  var filePath = path.join(__dirname, 'sqls', '20210416135254-init-down.sql');
  return new Promise(function (resolve, reject) {
    handleData(resolve, reject, filePath);
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports._meta = {
  version: 1,
};
