/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import {
  BrowserName,
  CompatStatement,
  SupportBlock,
} from '../../types/types.js';
import { IS_WINDOWS } from '../../test/utils.js';

/**
 * Return a new "support_block" object whose first-level properties
 * (browser names) have been ordered according to Array.prototype.sort,
 * and so will be stringified in that order as well. This relies on
 * guaranteed "own" property ordering, which is insertion order for
 * non-integer keys (which is our case).
 * @param key The key of the object
 * @param value The value of the key
 * @returns Value with sorting applied
 */
export const orderSupportBlock = (
  key: string,
  value: CompatStatement,
): CompatStatement => {
  if (key === '__compat') {
    value.support = (
      Object.keys(value.support) as (keyof typeof value.support)[]
    )
      .sort()
      .reduce((result: SupportBlock, key: BrowserName) => {
        result[key] = value.support[key];
        return result;
      }, {});
  }
  return value;
};

/**
 * Perform a fix of the browser order of a __compat.support block within
 * all the data in a specified file.  The function will then automatically
 * write any needed changes back into the file.
 * @param filename The path to the file to fix in-place
 */
const fixBrowserOrder = (filename: string): void => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderSupportBlock), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixBrowserOrder;
