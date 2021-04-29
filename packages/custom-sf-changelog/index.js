'use strict'
const Q = require('q')
const conventionalChangelogOuter = require('./conventional-changelog')
const parserOptsOuter = require('./parser-opts')
const recommendedBumpOptsOuter = require('./conventional-recommended-bump')
const writerOptsOuter = require('./writer-opts')

module.exports = Q.all([conventionalChangelogOuter, parserOptsOuter, recommendedBumpOptsOuter, writerOptsOuter])
  .spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    return { conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }
  })
