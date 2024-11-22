/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { Identifier } from '../../types/types.js';
import { checkExperimental } from '../linter/test-status.js';
import { IS_WINDOWS } from '../utils.js';
import walk from '../../utils/walk.js';

/**
 * Fix the status values
 * @param value The value to update
 * @returns The updated value
 */
export const fixStatusValue = (value: Identifier): Identifier => {
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

    if (compat.status.deprecated) {
      // All sub-features are also deprecated.
      for (const subfeature of walk(undefined, value)) {
        if (subfeature.compat.status) {
          subfeature.compat.status.deprecated = true;
        }
      }
    }

    if (compat.status.experimental) {
      // All sub-features are also experimental, unless they are deprecated.
      for (const subfeature of walk(undefined, value)) {
        if (subfeature.compat.status && !subfeature.compat.status.deprecated) {
          subfeature.compat.status.experimental = true;
        }
      }
    }

    if (compat.status.standard_track === false) {
      // All sub-features are also experimental
      for (const subfeature of walk(undefined, value)) {
        if (subfeature.compat.status) {
          subfeature.compat.status.standard_track = false;
        }
      }
    }
  }

  return value;
};

/**
 * Fix feature statuses throughout the BCD files
 * @param filename The name of the file to fix
 */
const fixStatusFromFile = (filename: string): void => {
  if (filename.includes('/browsers/')) {
    return;
  }

  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, (_key: string, value: Identifier) =>
      fixStatusValue(value),
    ),
    null,
    2,
  );

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
