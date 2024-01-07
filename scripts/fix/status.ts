/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { Identifier } from '../../types/types.js';
import { IS_WINDOWS } from '../../test/utils.js';

/**
 * Fix the status values
 * @param key The key of the object
 * @param value The value to update
 * @returns The updated value
 */
const fixStatus = (key: string, value: Identifier): Identifier => {
  if (value?.__compat?.status?.experimental) {
    delete (value.__compat.status as any).experimental;
  }
  if (value?.__compat?.status?.standard_track) {
    delete (value.__compat.status as any).standard_track;
  }

  return value;
};

/**
 * Fix feature statuses throughout the BCD files
 * @param filename The name of the file to fix
 */
const fixStatusFromFile = (filename: string): void => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, fixStatus), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixStatusFromFile;
