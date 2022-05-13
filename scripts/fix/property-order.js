/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs');
const path = require('path');
const { platform } = require('os');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

const compareFeatures = require('../compare-features');

const propOrder = {
  __compat: [
    'description',
    'mdn_url',
    'spec_url',
    'matches',
    'support',
    'status',
  ],
  status: ['experimental', 'standard_track', 'deprecated'],
};

function doOrder(value, order) {
  return order.reduce((result, key) => {
    if (key in value) result[key] = value[key];
    return result;
  }, {});
}

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */
function orderProperties(key, value) {
  if (value instanceof Object && '__compat' in value) {
    value.__compat = doOrder(value.__compat, propOrder.__compat);

    if ('status' in value.__compat) {
      value.__compat.status = doOrder(value.__compat.status, propOrder.status);
    }
  }
  return value;
}

/**
 * @param {string} filename
 */
const fixPropertyOrder = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderProperties), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

module.exports = fixPropertyOrder;
