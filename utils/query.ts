/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatData,
  CompatStatement,
  BrowserName,
  Identifier,
  BrowserStatement,
} from '../types/types.js';
import { DataType } from './walkingUtils.js';

import bcd from '../index.js';

/**
 * Get a subtree of compat data.
 *
 * @param {string} path Dotted path to a given feature (e.g., `css.properties.background`)
 * @param {DataType} [data=bcd] A tree to query. All of BCD, by default.
 * @returns {DataType} A BCD subtree
 * @throws {ReferenceError} For invalid identifiers
 */
export default function query(path: string, data: DataType = bcd): DataType {
  const pathElements = path.split('.');
  let lookup = data;
  while (pathElements.length) {
    const next = pathElements.shift();
    if (!next) {
      throw new ReferenceError(
        `${path} is not a valid tree identifier (failed at '${next}')`,
      );
    }
    lookup = lookup as DataType)[next];
    if (lookup === undefined) {
      throw new ReferenceError(
        `${path} is not a valid tree identifier (failed at '${next}')`,
      );
    }
  }
  return lookup;
}
