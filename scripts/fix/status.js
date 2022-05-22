/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFileSync, writeFileSync } from 'node:fs';

import { IS_WINDOWS } from '../../test/utils.js';

/**
 * @param {string} parentKey
 * @param {import('../../types.js').Identifier} parentValue
 * @returns
 */
const fixStatusInheritance = (parentKey, parentValue) => {
  const parentStatus = parentValue?.__compat?.status;
  if (!parentStatus) {
    return parentValue;
  }
  for (const [childKey, childValue] of Object.entries(parentValue)) {
    if (childKey === '__compat' || !childValue?.__compat) {
      continue;
    }
    const childStatus = childValue.__compat.status;
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

/**
 * @param {Promise<void>} filename
 */
const fixStatus = (filename) => {
  let actual = readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, fixStatusInheritance),
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
