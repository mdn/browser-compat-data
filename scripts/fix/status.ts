/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatStatement, Identifier } from '../../types/types.js';

import fs from 'node:fs';

import { checkExperimental } from '../../test/linter/test-status.js';
import { IS_WINDOWS } from '../../test/utils.js';

/**
 * Fix the status values
 *
 * @param {Identifier} value The value to update
 * @returns {Identifier} The updated value
 */
const fixStatusContradiction = (value: Identifier): Identifier => {
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

const fixStatusInheritance = (parentValue: Identifier) => {
  const parentStatus = parentValue?.__compat?.status;
  if (!parentStatus) {
    return parentValue;
  }
  for (const [childKey, childValue] of Object.entries(parentValue)) {
    if (childKey === '__compat') {
      continue;
    }
    const compat = (childValue as Identifier)?.__compat;
    if (!compat?.status) {
      continue;
    }
    const childStatus = compat.status;
    if (!childStatus?.deprecated && parentStatus.deprecated) {
      childStatus.deprecated = true;
    }
    if (
      !childStatus?.experimental &&
      !childStatus.deprecated &&
      parentStatus.experimental
    ) {
      childStatus.experimental = true;
    }
    if (childStatus?.standard_track && !parentStatus.standard_track) {
      childStatus.standard_track = false;
    }
  }
  return parentValue;
};

const fixAll = (key: string, value: Identifier) => {
  value = fixStatusContradiction(value);
  value = fixStatusInheritance(value);
  return value;
};

/**
 * Fix feature statuses throughout the BCD files
 *
 * @param {string} filename The name of the file to fix
 */
const fixStatusFromFile = (filename: string): void => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, fixAll), null, 2);

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
