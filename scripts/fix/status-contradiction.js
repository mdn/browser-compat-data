#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

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

'use strict';
const fs = require('fs');
const { platform } = require('os');

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

module.exports = fixStatusContradiction;
