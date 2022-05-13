/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const path = require('path');
const chalk = require('chalk');
const { Logger } = require('../utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * Check the prefix of a specific feature
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @param {string} prefix The browser-based prefix to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} [path] The path to the data
 * @returns {string[]} Any errors found within the data
 */
function checkPrefix(data, category, prefix, logger, path = '') {
  for (const key in data) {
    if (key === 'prefix' && typeof data[key] === 'string') {
      if (data[key].includes(prefix)) {
        const rules = [
          category == 'api' && !data[key].startsWith(prefix),
          category == 'css' && !data[key].startsWith(`-${prefix}`),
        ];
        if (rules.some((x) => x === true)) {
          logger.error(
            chalk`{bold ${prefix}} prefix is wrong for key: {bold ${path}}`,
          );
        }
      }
    } else {
      if (typeof data[key] === 'object') {
        const curr_path = path.length > 0 ? `${path}.${key}` : key;
        checkPrefix(data[key], category, prefix, logger, curr_path);
      }
    }
  }
}

/**
 * Process the data for prefix errors
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(data, category, logger) {
  let prefixes = [];

  if (category === 'api') {
    prefixes = ['moz', 'Moz', 'webkit', 'WebKit', 'webKit', 'ms', 'MS'];
  }
  if (category === 'css') {
    prefixes = ['webkit', 'moz', 'ms'];
  }

  for (const prefix of prefixes) {
    checkPrefix(data, category, prefix, logger);
  }
}

/**
 * Test for issues with feature's prefix
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
function testPrefix(filename) {
  const logger = new Logger('Prefix');

  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  const data = require(filename);

  processData(data, category, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testPrefix;
