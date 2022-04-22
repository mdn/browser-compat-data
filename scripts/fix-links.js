#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';

const fs = require('fs');
const { platform } = require('os');

const { processData } = require('../test/linter/test-links.js');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

/**
 * @param {Promise<void>} filename
 */
const fixLinks = (filename) => {
  let errors = processData(filename);
  let original = fs.readFileSync(filename, 'utf-8').trim();
  let data = original;

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    data = data.replace(/\r/g, '');
  }

  for (let error of errors) {
    if (error.expected) {
      data = data.replace(error.actual, error.expected);
    }
  }

  if (original !== data) {
    fs.writeFileSync(filename, data + '\n', 'utf-8');
  }
};

module.exports = fixLinks;
