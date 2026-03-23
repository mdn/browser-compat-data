/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import compareStatements from '../../scripts/lib/compare-statements.js';

/** @import {BrowserName, InternalCompatStatement} from '../../types/index.js' */

/**
 * Return a new "support_block" object whose support statements have
 * been ordered in reverse chronological order, moving statements
 * with flags, partial support, prefixes, or alternative names lower.
 * @param {string} key The key in the object
 * @param {InternalCompatStatement} value The value of the key
 * @returns {InternalCompatStatement} The new value
 */
export const orderStatements = (key, value) => {
  if (key === '__compat') {
    for (const browser of /** @type {BrowserName[]} */ (
      Object.keys(value.support)
    )) {
      const supportData = value.support[browser];
      if (Array.isArray(supportData)) {
        value.support[browser] = supportData.sort(compareStatements);
      }
    }
  }
  return value;
};

/**
 * Fix issues with statement order throughout the BCD files
 * @param {string} filename The name of the file to fix
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixStatementOrder = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  return JSON.stringify(JSON.parse(actual, orderStatements), null, 2);
};

export default fixStatementOrder;
