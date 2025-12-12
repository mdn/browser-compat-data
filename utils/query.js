/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import bcd from '../index.js';

/**
 * @typedef {import('../types/index.js').DataType} DataType
 */

/**
 * Get a subtree of compat data.
 * @param {string} path Dotted path to a given feature (e.g., `css.properties.background`)
 * @param {DataType} [data] A tree to query. All of BCD, by default.
 * @returns {DataType} A BCD subtree
 * @throws {ReferenceError} For invalid identifiers
 */
export default (path, data = bcd) => {
  const pathElements = path.split('.');
  let lookup = data;
  while (pathElements.length) {
    const next = /** @type {string} */ (pathElements.shift());
    lookup = lookup[next];
    if (lookup === undefined) {
      throw new ReferenceError(
        `${path} is not a valid tree identifier (failed at '${next}')`,
      );
    }
  }
  return lookup;
};
