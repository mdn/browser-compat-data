/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const path = require('path');
const chalk = require('chalk');
const { Logger } = require('../utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 * @typedef {import('../utils').Logger} Logger
 */

/** @type {string[]} */
const blockMany = [
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'firefox_android',
  'ie',
  'opera',
  'opera_android',
  'safari',
  'safari_ios',
  'samsunginternet_android',
  'webview_android',
];

/** @type {object.<string, string[]>} */
const blockList = {
  api: blockMany,
  css: blockMany,
  html: [],
  http: [],
  svg: [],
  javascript: [...blockMany, 'nodejs'],
  mathml: blockMany,
  webdriver: blockMany,
  webextensions: [],
};

/**
 * Check if the feature has any browsers with nonreal data
 *
 * @param {SupportBlock} supportData The data to test
 * @param {string[]} blockList The list of browsers required to have real values
 * @param {string} relPath The path of the data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function checkRealValues(supportData, blockList, relPath, logger) {
  for (const browser of blockList) {
    /** @type {SimpleSupportStatement[]} */
    const supportStatements = [];
    if (Array.isArray(supportData[browser])) {
      Array.prototype.push.apply(supportStatements, supportData[browser]);
    } else {
      supportStatements.push(supportData[browser]);
    }

    for (const statement of supportStatements) {
      if (statement === undefined) {
        logger.error(
          chalk`{bold ${browser}} must be defined for {bold ${relPath}}`,
        );
      } else {
        if ([true, null].includes(statement.version_added)) {
          logger.error(
            chalk`{bold ${relPath}} - {bold ${browser}} no longer accepts {bold ${statement.version_added}} as a value`,
          );
        }
        if ([true, null].includes(statement.version_removed)) {
          logger.error(
            chalk`{bold ${relPath}} - {bold ${browser}} no longer accepts {bold ${statement.version_removed}} as a value`,
          );
        }
      }
    }
  }
}

/**
 * Process the data for nonreal values
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @param {Logger} logger The logger to output errors to
 * @param {string} [relPath] The path to the data
 * @returns {void}
 */
function findSupport(data, category, logger, relPath) {
  for (const prop in data) {
    if (prop === '__compat' && data[prop].support) {
      if (blockList[category] && blockList[category].length > 0)
        checkRealValues(
          data[prop].support,
          blockList[category],
          relPath,
          logger,
        );
    }
    const sub = data[prop];
    if (typeof sub === 'object') {
      findSupport(
        sub,
        category,
        logger,
        relPath ? `${relPath}.${prop}` : `${prop}`,
      );
    }
  }
}

/**
 * Test for real values within the data
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
function testRealValues(filename) {
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
  /** @type {Identifier} */
  const data = require(filename);
  const logger = new Logger('Real values');

  findSupport(data, category, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testRealValues;
