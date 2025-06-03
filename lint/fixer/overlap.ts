/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { BrowserName, CompatStatement } from '../../types/types.js';
import { checkOverlap as checkOverlap } from '../common/overlap.js';

/**
 * Return a new "support_block" object whose support statements have
 * been updated to avoid overlapping version ranges.
 * @param key The key in the object
 * @param value The value of the key
 * @returns The new value
 */
export const processStatement = (
  key: string,
  value: CompatStatement,
): CompatStatement => {
  if (key === '__compat') {
    for (const browser of Object.keys(value.support) as BrowserName[]) {
      const supportData = value.support[browser];
      if (Array.isArray(supportData)) {
        value.support[browser] = checkOverlap(supportData, browser, {
          fix: true,
        });
      }
    }
  }
  return value;
};

/**
 * Fix issues with statement order throughout the BCD files
 * @param filename The name of the file to fix
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixOverlap = (filename: string, actual: string): string => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  return JSON.stringify(JSON.parse(actual, processStatement), null, 2);
};

export default fixOverlap;
