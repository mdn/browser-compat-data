/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFileSync, writeFileSync } from 'node:fs';

import { IS_WINDOWS } from '../../test/utils.js';

/**
 * @param {import('../../types.js').Identifier} parentValue
 */
const fixStatusInheritance = (parentValue) => {
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
 * @param {import('../../types.js').Identifier} parentValue
 */
const fixStatusContradiction = (value) => {
  const status = value?.__compat?.status;
  if (status && status.experimental && status.deprecated) {
    status.experimental = false;
  }
  return value;
};

/**
 * @param {string} key
 * @param {import('../../types.js').Identifier} value
 * @returns
 */
const fixAll = (key, value) => {
  value = fixStatusContradiction(value);
  value = fixStatusInheritance(value);
  return value;
};

/**
 * @param {Promise<void>} filename
 */
const fixStatus = (filename) => {
  let actual = readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, fixAll), null, 2);

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
