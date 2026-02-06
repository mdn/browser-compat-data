/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import stringifyAndOrderProperties from '../../scripts/lib/stringify-and-order-properties.js';

/**
 * Fix issues with the property order throughout the BCD files
 * @param {string} filename The name of the file to fix
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixPropertyOrder = (filename, actual) => {
  const expected = stringifyAndOrderProperties(actual);

  return expected;
};

export default fixPropertyOrder;
