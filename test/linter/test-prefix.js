/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const path = require('path');
const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * Check the prefix of a specific feature
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @param {string[]} errors The errors object to push the new errors to
 * @param {string} prefix The browser-based prefix to test
 * @param {string} [path] The path to the data
 * @returns {string[]} Any errors found within the data
 */
function checkPrefix(data, category, errors, prefix, path = '') {
  for (const key in data) {
    if (key === 'prefix' && typeof data[key] === 'string') {
      if (data[key].includes(prefix)) {
        const error = chalk`{red → {bold ${prefix}} prefix is wrong for key: {bold ${path}}}`;
        const rules = [
          category == 'api' && !data[key].startsWith(prefix),
          category == 'css' && !data[key].startsWith(`-${prefix}`),
        ];
        if (rules.some((x) => x === true)) {
          errors.push(error);
        }
      }
    } else {
      if (typeof data[key] === 'object') {
        const curr_path = path.length > 0 ? `${path}.${key}` : key;
        checkPrefix(data[key], category, errors, prefix, curr_path);
      }
    }
  }
  return errors;
}

/**
 * Process the data for prefix errors
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @returns {string[]} Any errors found within the data
 */
function processData(data, category) {
  let errors = [];
  let prefixes = [];

  if (category === 'api') {
    prefixes = ['moz', 'Moz', 'webkit', 'WebKit', 'webKit', 'ms', 'MS'];
  }
  if (category === 'css') {
    prefixes = ['webkit', 'moz', 'ms'];
  }

  for (const prefix of prefixes) {
    checkPrefix(data, category, errors, prefix);
  }
  return errors;
}

/**
 * Test for issues with feature's prefix
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
function testPrefix(filename) {
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  const data = require(filename);
  const errors = processData(data, category);

  if (errors.length) {
    console.error(
      chalk`{red   Prefix – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testPrefix;
