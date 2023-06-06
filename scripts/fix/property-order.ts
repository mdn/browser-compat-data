/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { Identifier, CompatStatement, StatusBlock } from '../../types/types.js';
import { IS_WINDOWS } from '../../test/utils.js';

const propOrder = {
  __compat: [
    'description',
    'mdn_url',
    'spec_url',
    'matches',
    'support',
    'status',
  ],
  status: ['experimental', 'standard_track', 'deprecated'],
};

/**
 * Perform property ordering
 * @param {CompatStatement|StatusBlock} value The object to order properties for
 * @param {string[]} order The order to follow
 * @returns {CompatStatement|StatusBlock} The ordered object
 */
const doOrder = <T>(value: T, order: string[]): T => {
  if (value && typeof value === 'object') {
    return order.reduce((result: { [index: string]: any }, key: string) => {
      if (key in value) {
        result[key] = value[key];
      }
      return result;
    }, {}) as T;
  }
  return value;
};

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to doOrder, and so will be stringified in that
 * order as well. This relies on guaranteed "own" property ordering,
 * which is insertion order for non-integer keys (which is our case).
 * @param {string} key The key in the object
 * @param {Identifier} value The value of the key
 * @returns {Identifier} The new value
 */
export const orderProperties = (key: string, value: Identifier): Identifier => {
  if (value instanceof Object && '__compat' in value) {
    value.__compat = doOrder(
      value.__compat as CompatStatement,
      propOrder.__compat,
    );

    if ('status' in value.__compat) {
      value.__compat.status = doOrder(
        value.__compat.status as StatusBlock,
        propOrder.status,
      );
    }
  }
  return value;
};

/**
 * Fix issues with the property order throughout the BCD files
 * @param {string} filename The name of the file to fix
 */
const fixPropertyOrder = (filename: string): void => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderProperties), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixPropertyOrder;
