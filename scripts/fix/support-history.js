/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

const fs = require('fs');
const { hasSupportHistory } = require('../../test/linter/test-support-history');

/**
 * @param {Identifier} data
 */
function check(data) {
  let hasIssue = false;
  if (data.__compat && !hasSupportHistory(data)) {
    hasIssue = true;
  }
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    if (check(data[member])) {
      delete data[member];
    }
  }
  return hasIssue;
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function fixSupportHistory(filename) {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let data = JSON.parse(actual);

  check(data);
  let expected = JSON.stringify(data, null, 2);

  let target = data;
  while (Object.keys(target).length === 1) {
    target = Object.values(target)[0];
  }
  if (Object.keys(target).length) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  } else {
    fs.unlinkSync(filename);
  }
}

module.exports = fixSupportHistory;
