/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

import { readFileSync, writeFileSync } from 'fs';
import { platform } from 'os';

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

const fixStatus = (key, value) => {
  const status = value?.__compat?.status;
  if (status && status.experimental && status.deprecated) {
    status.experimental = false;
  }
  return value;
};

/**
 * @param {Promise<void>} filename
 */
const fixStatusContradiction = (filename) => {
  let actual = readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, fixStatus), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixStatusContradiction;
