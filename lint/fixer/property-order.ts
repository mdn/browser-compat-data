/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { IS_WINDOWS } from '../utils.js';
import stringifyAndOrderProperties from '../../scripts/lib/stringify-and-order-properties.js';

/**
 * Fix issues with the property order throughout the BCD files
 * @param filename The name of the file to fix
 */
const fixPropertyOrder = (filename: string): void => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = stringifyAndOrderProperties(actual);

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
