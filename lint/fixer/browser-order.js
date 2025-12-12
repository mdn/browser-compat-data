/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {import('../../types/types.js').BrowserName} BrowserName
 * @typedef {import('../../types/types.js').CompatStatement} CompatStatement
 * @typedef {import('../../types/types.js').SupportBlock} SupportBlock
 */

/**
 * Return a new "support_block" object whose first-level properties
 * (browser names) have been ordered according to Array.prototype.sort,
 * and so will be stringified in that order as well. This relies on
 * guaranteed "own" property ordering, which is insertion order for
 * non-integer keys (which is our case).
 * @param {string} key The key of the object
 * @param {CompatStatement} value The value of the key
 * @returns {CompatStatement} Value with sorting applied
 */
export const orderSupportBlock = (key, value) => {
  if (key === '__compat') {
    value.support = /** @type {(keyof typeof value.support)[]} */ (
      Object.keys(value.support)
    )
      .sort()
      .reduce(
        /**
         * @param {SupportBlock} result
         * @param {BrowserName} key
         * @returns {SupportBlock}
         */
        (result, key) => {
          result[key] = value.support[key];
          return result;
        },
        /** @type {SupportBlock} */ ({}),
      );
  }
  return value;
};

/**
 * Perform a fix of the browser order of a __compat.support block within
 * all the data in a specified file.  The function will then automatically
 * write any needed changes back into the file.
 * @param {string} filename The path to the file to fix in-place
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixBrowserOrder = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  return JSON.stringify(JSON.parse(actual, orderSupportBlock), null, 2);
};

export default fixBrowserOrder;
