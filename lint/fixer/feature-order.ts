/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier } from '../../types/types.js';
import compareFeatures from '../../scripts/lib/compare-features.js';

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 * @param _ The key in the object
 * @param value The value of the key
 * @returns The new value
 */
export const orderFeatures = (_: string, value: Identifier): Identifier => {
  if (value instanceof Object && '__compat' in value) {
    value = Object.keys(value)
      .sort(compareFeatures)
      .reduce((result: Identifier, key: string) => {
        result[key] = value[key];
        return result;
      }, {});
  }
  return value;
};

/**
 * Perform a fix of feature order within all the data in a specified file.
 * The function will then automatically write any needed changes back into the file.
 * @param filename The filename to perform fix upon
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixFeatureOrder = (filename: string, actual: string): string => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  return JSON.stringify(JSON.parse(actual, orderFeatures), null, 2);
};

export default fixFeatureOrder;
