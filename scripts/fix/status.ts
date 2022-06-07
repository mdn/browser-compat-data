/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier } from '../../types/types.js';

import { readFileSync, writeFileSync } from 'node:fs';

import { IS_WINDOWS } from '../../test/utils.js';

const fixStatusContradiction = (key: string, value: Identifier): Identifier => {
  const status = value?.__compat?.status;
  if (status && status.experimental && status.deprecated) {
    status.experimental = false;
  }
  return value;
};

/**
 * @param {string} filename
 */
const fixStatus = (filename: string): void => {
  let actual = readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, fixStatusContradiction),
    null,
    2,
  );

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixStatus;
