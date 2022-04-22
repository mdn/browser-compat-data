'use strict';
const path = require('path');
const chalk = require('chalk');
const { Logger } = require('../utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} data
 * @param {string} category
 * @param {string} prefix
 * @param {Logger} logger
 * @param {string} [path]
 * @return {void}
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
 * @param {Identifier} data
 * @param {string} category
 * @param {Logger} logger
 * @return {void}
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
 * @param {string} filename
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
