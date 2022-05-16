/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';
const fs = require('fs');
const { platform } = require('os');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

const fixStatus = (parentKey, parentValue) => {
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
    if (!childStatus?.experimental && parentStatus.experimental) {
      childStatus.experimental = true;
    }
  }
  return parentValue;
};

/**
 * @param {Promise<void>} filename
 */
const fixStatusInheritance = (filename) => {
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

module.exports = fixStatusInheritance;
