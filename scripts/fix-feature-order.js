/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

const fs = require('fs');
const { platform } = require('os');

const compareFeatures = require('./compare-features');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 *
 * @param {string} key The key in the object
 * @param {Identifier} value The value of the key
 * @returns {Identifier} The new value
 */
function orderFeatures(key, value) {
  if (value instanceof Object && '__compat' in value) {
    value = Object.keys(value)
      .sort(compareFeatures)
      .reduce((result, key) => {
        result[key] = value[key];
        return result;
      }, {});
  }
  return value;
}

/**
 * Perform a fix of feature order within all the data in a specified file.
 * The function will then automatically write any needed changes back into the file.
 *
 * @param {string} filename The filename to perform fix upon
 * @returns {void}
 */
const fixFeatureOrder = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderFeatures), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

module.exports = fixFeatureOrder;
