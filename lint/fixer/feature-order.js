/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import compareFeatures from '../../scripts/lib/compare-features.js';

/** @import {Identifier} from '../../types/types.js' */

/**
 * Check whether an object contains compat data anywhere in its subtree.
 * @param {object} obj - The object to check
 * @returns {boolean}
 */
const hasCompatData = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  if ('__compat' in obj) {
    return true;
  }
  return Object.values(obj).some(hasCompatData);
};

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
  if (value instanceof Object && hasCompatData(value)) {
    value = /** @type {Identifier} */ (
      Object.fromEntries(
        Object.entries(value).sort(([a], [b]) => compareFeatures(a, b)),
      )
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
