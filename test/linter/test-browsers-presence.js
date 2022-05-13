/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const path = require('path');
const chalk = require('chalk');
const { Logger } = require('../utils.js');

const { browsers } = require('../../index.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * Check the data for any disallowed browsers or if it's missing required browsers
 *
 * @param {Identifier} data The data to test
 * @param {string[]} displayBrowsers All of the allowed browsers for this data.
 * @param {string[]} requiredBrowsers All of the required browsers for this data.
 * @param {string} category The category the data belongs to.
 * @param {Logger} logger The logger to output errors to.
 * @param {string} [path] The path of the data.
 * @returns {void}
 */
function processData(data, category, logger, path = '') {
  if (data.__compat && data.__compat.support) {
    const support = data.__compat.support;
    const definedBrowsers = Object.keys(support);

    let displayBrowsers = [
      ...Object.keys(browsers).filter((b) =>
        ['desktop', 'mobile'].includes(browsers[b].type),
      ),
      ,
    ];
    let requiredBrowsers = [
      ...Object.keys(browsers).filter((b) => browsers[b].type == 'desktop'),
    ];

    if (category === 'api' || category === 'javascript') {
      displayBrowsers.push(
        ...Object.keys(browsers).filter((b) => browsers[b].type == 'server'),
      );
    }

    if (category === 'webextensions') {
      displayBrowsers = displayBrowsers.filter(
        (b) => browsers[b].accepts_webextensions,
      );
      requiredBrowsers = requiredBrowsers.filter(
        (b) => browsers[b].accepts_webextensions,
      );
    }

    const undefEntries = definedBrowsers.filter(
      (value) => !(value in browsers),
    );
    if (undefEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} has the following browsers, which are not defined in BCD: {bold ${undefEntries.join(
          ', ',
        )}}}`,
      );
    }

    const invalidEntries = Object.keys(support).filter(
      (value) => !displayBrowsers.includes(value),
    );
    if (invalidEntries.length > 0) {
      logger.error(
        chalk`{bold ${path}} has the following browsers, which are invalid for {bold ${category}} compat data: {bold ${invalidEntries.join(
          ', ',
        )}}`,
      );
    }

    const missingEntries = requiredBrowsers.filter(
      (value) => !(value in support),
    );
    if (missingEntries.length > 0) {
      logger.error(
        chalk`{bold ${path}} is missing the following browsers, which are required for {bold ${category}} compat data: {bold ${missingEntries.join(
          ', ',
        )}}`,
      );
    }
  }
  for (const key in data) {
    if (key === '__compat') continue;

    processData(
      data[key],
      category,
      logger,
      path && path.length > 0 ? `${path}.${key}` : key,
    );
  }
}

/**
 * Test for issues within the browsers in the data within the specified file.
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
function testBrowsersPresence(filename) {
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Browsers');

  processData(data, category, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testBrowsersPresence;
