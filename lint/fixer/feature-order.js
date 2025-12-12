/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import compareFeatures from '../../scripts/lib/compare-features.js';

/**
 * @typedef {import('../../types/types.js').Identifier} Identifier
 */

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 * @param {string} _ The key in the object
 * @param {Identifier} value The value of the key
 * @returns {Identifier} The new value
 */
export const orderFeatures = (_, value) => {
  if (value instanceof Object && '__compat' in value) {
    value = Object.keys(value)
      .sort(compareFeatures)
      .reduce(
        /**
         * @param {Identifier} result
         * @param {string} key
         * @returns {Identifier}
         */
        (result, key) => {
          result[key] = value[key];
          return result;
        },
        /** @type {Identifier} */ ({}),
      );
  }
  return value;
};

/**
 * Perform a fix of feature order within all the data in a specified file.
 * The function will then automatically write any needed changes back into the file.
 * @param {string} filename The filename to perform fix upon
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixFeatureOrder = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  return JSON.stringify(JSON.parse(actual, orderFeatures), null, 2);
};

export default fixFeatureOrder;
