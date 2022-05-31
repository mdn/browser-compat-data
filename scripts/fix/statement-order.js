/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { IS_WINDOWS } from '../../test/utils.js';

import compareStatements from '../lib/compare-statements.js';

/**
 * Return a new "support_block" object whose support statements have
 * been ordered in reverse chronological order, moving statements
 * with flags, partial support, prefixes, or alternative names lower.
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */
function orderStatements(key, value) {
  if (key === '__compat') {
    for (let browser of Object.keys(value.support)) {
      let supportData = value.support[browser];
      if (Array.isArray(supportData)) {
        value.support[browser] = supportData.sort(compareStatements);
      }
    }
  }
  return value;
}

/**
 * @param {Promise<void>} filename
 */
const fixStatementOrder = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderStatements), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixStatementOrder;
