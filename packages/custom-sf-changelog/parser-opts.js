'use strict';

module.exports = {
  headerPattern: /^(\w+)(?:\(([^)]+)\))?: (.+)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  noteKeywords: ['BREAKING CHANGE', 'MIGRATION CHANGE'],
  revertPattern:
    /^(?:Revert|revert:)\s"([^"\r\n]{1,1000})"\s+This reverts commit ([a-fA-F0-9]{7,40})\.$/i,
  revertCorrespondence: ['header', 'hash'],
};
