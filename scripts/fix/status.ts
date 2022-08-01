/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Identifier } from '../../types/types.js';

import fs from 'node:fs';

import { checkExperimental } from '../../test/linter/test-status.js';
import { IS_WINDOWS } from '../../test/utils.js';

const fixStatus = (key: string, value: Identifier): Identifier => {
  const compat = value?.__compat;
  if (compat?.status) {
    if (compat.status.experimental && compat.status.deprecated) {
      compat.status.experimental = false;
    }

    if (compat.spec_url && compat.status.standard_track === false) {
      compat.status.standard_track = true;
    }

    if (!checkExperimental(compat)) {
      compat.status.experimental = false;
    }
  }

  return value;
};

/**
 * @param {string} filename
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
