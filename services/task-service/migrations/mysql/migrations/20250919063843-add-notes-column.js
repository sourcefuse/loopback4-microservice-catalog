'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function (db) {
  const filePath = path.join(
    __dirname,
    'sqls',
    '20250919063843-add-notes-column-up.sql',
  );
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
      if (err) return reject(err);

      resolve(data);
    });
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports.down = function (db) {
  const filePath = path.join(
    __dirname,
    'sqls',
    '20250919063843-add-notes-column-down.sql',
  );
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
      if (err) return reject(err);

      resolve(data);
    });
  }).then(function (data) {
    return db.runSql(data);
  });
};

exports._meta = {
  version: 1,
};
