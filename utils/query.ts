/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { DataType } from '../types/index.js';
import bcd from '../index.js';

/**
 * Get a subtree of compat data.
 * @param path Dotted path to a given feature (e.g., `css.properties.background`)
 * @param data A tree to query. All of BCD, by default.
 * @returns A BCD subtree
 * @throws {ReferenceError} For invalid identifiers
 */
export default (path: string, data: DataType = bcd): DataType => {
  const pathElements = path.split('.');
  let lookup = data;
  while (pathElements.length) {
    // "as string" cast performed because we know that pathElements.length > 0
    const next = pathElements.shift() as string;
    lookup = lookup[next];
    if (lookup === undefined) {
      throw new ReferenceError(
        `${path} is not a valid tree identifier (failed at '${next}')`,
      );
    }
  }
  return lookup;
};
