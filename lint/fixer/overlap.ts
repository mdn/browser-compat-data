/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { BrowserName, CompatStatement } from '../../types/types.js';
import { IS_WINDOWS } from '../utils.js';
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
 */
const fixOverlap = (filename: string): void => {
  if (filename.includes('/browsers/')) {
    return;
  }

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, processStatement), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixOverlap;
