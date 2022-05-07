'use strict';
const path = require('path');
const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/** @type {object.<string, string[]>} */
const browsers = {
  desktop: ['chrome', 'edge', 'firefox', 'ie', 'opera', 'safari'],
  mobile: [
    'chrome_android',
    'firefox_android',
    'opera_android',
    'safari_ios',
    'samsunginternet_android',
    'webview_android',
  ],
  server: ['nodejs', 'deno'],
  'webextensions-desktop': ['chrome', 'edge', 'firefox', 'opera', 'safari'],
  'webextensions-mobile': ['firefox_android', 'safari_ios'],
};

/**
 * Check the data for any disallowed browsers or if it's missing required browsers
 *
 * @param {Identifier} data The data to test
 * @param {string[]} displayBrowsers All of the allowed browsers for this data
 * @param {string[]} requiredBrowsers All of the required browsers for this data
 * @param {string} category The category the data belongs to
 * @param {Logger} logger The logger to output errors to
 * @param {string} [path] The path of the data
 * @returns {void}
 */
function processData(
  data,
  displayBrowsers,
  requiredBrowsers,
  category,
  logger,
  path = '',
) {
  if (data.__compat && data.__compat.support) {
    const support = data.__compat.support;

    const invalidEntries = Object.keys(support).filter(
      (value) => !displayBrowsers.includes(value),
    );
    if (invalidEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} has the following browsers, which are invalid for {bold ${category}} compat data: {bold ${invalidEntries.join(
          ', ',
        )}}}`,
      );
    }

    const missingEntries = requiredBrowsers.filter(
      (value) => !(value in support),
    );
    if (missingEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} is missing the following browsers, which are required for {bold ${category}} compat data: {bold ${missingEntries.join(
          ', ',
        )}}}`,
      );
    }

    for (const [browser, supportStatement] of Object.entries(support)) {
      const statementList = Array.isArray(supportStatement)
        ? supportStatement
        : [supportStatement];
      /**
       * Checks a support statement and identifies whether it only has 'version_added'
       *
       * @param {Identifier} statement The support statement to check
       * @returns {boolean} If the statement only has 'version_added'
       */
      function hasVersionAddedOnly(statement) {
        const keys = Object.keys(statement);
        return keys.length === 1 && keys[0] === 'version_added';
      }
      let sawVersionAddedOnly = false;
      for (const statement of statementList) {
        if (hasVersionAddedOnly(statement)) {
          if (sawVersionAddedOnly) {
            logger.error(
              chalk`{red → '{bold ${path}}' has multiple support statement with only \`{bold version_added}\` for {bold ${browser}}}`,
            );
            break;
          } else {
            sawVersionAddedOnly = true;
          }
        }
      }
    }
  }
  for (const key in data) {
    if (key === '__compat') continue;

    processData(
      data[key],
      displayBrowsers,
      requiredBrowsers,
      category,
      logger,
      path && path.length > 0 ? `${path}.${key}` : key,
    );
  }
}

/**
 * @param {string} filename
 * Test for issues within the browsers in the data within the specified file
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

  if (!category) {
    console.warn(chalk.blackBright('  Browsers – Unknown category'));
    return false;
  }

  let displayBrowsers = [...browsers['desktop'], ...browsers['mobile']];
  let requiredBrowsers = browsers['desktop'];
  if (category === 'api') {
    displayBrowsers.push('nodejs');
    displayBrowsers.push('deno');
  }
  if (category === 'javascript') {
    displayBrowsers.push(...browsers['server']);
  }
  if (category === 'webextensions') {
    displayBrowsers = [
      ...browsers['webextensions-desktop'],
      ...browsers['webextensions-mobile'],
    ];
    requiredBrowsers = browsers['webextensions-desktop'];
  }
  displayBrowsers.sort();
  requiredBrowsers.sort();

  const logger = new Logger('Browsers');

  processData(data, displayBrowsers, requiredBrowsers, category, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testBrowsersPresence;
