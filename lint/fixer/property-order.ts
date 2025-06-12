/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import stringifyAndOrderProperties from '../../scripts/lib/stringify-and-order-properties.js';

/**
 * Fix issues with the property order throughout the BCD files
 * @param filename The name of the file to fix
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixPropertyOrder = (filename: string, actual: string): string => {
  const expected = stringifyAndOrderProperties(actual);

  return expected;
};

export default fixPropertyOrder;
