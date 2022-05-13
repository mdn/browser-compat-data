/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const bcd = require('..');

/**
 * Get a subtree of compat data.
 *
 * @param {string} path Dotted path to a given feature (e.g., `css.properties.background`)
 * @param {*} [data=bcd] A tree to query. All of BCD, by default.
 * @returns {*} A BCD subtree
 * @throws {ReferenceError} For invalid identifiers
 */
function query(path, data = bcd) {
  const pathElements = path.split('.');
  let lookup = data;
  while (pathElements.length) {
    const next = pathElements.shift();
    lookup = lookup[next];
    if (lookup === undefined) {
      throw new ReferenceError(
        `${path} is not a valid tree identifier (failed at '${next}')`,
      );
    }
  }
  return lookup;
}

module.exports = query;
