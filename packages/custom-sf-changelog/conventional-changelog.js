'use strict';

const Q = require('q');
const parserOpts = require('./parser-opts');
const writerOpts = require('./writer-opts');

module.exports = Q.all([parserOpts, writerOpts]).spread(
  (parserOptsInner, writerOptsInner) => {
    return {parserOptsInner, writerOptsInner};
  },
);
