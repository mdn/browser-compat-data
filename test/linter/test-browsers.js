'use strict';
const path = require('path');
const chalk = require('chalk');
const { walkCompatData } = require('../utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').CompatStatement} CompatStatement
 */

/** @type {Record<string, string[]>} */
const browsers = {
  desktop: [
    'chrome',
    'edge',
    'firefox',
    'ie',
    'opera',
    'safari',
  ],
  mobile: [
    'chrome_android',
    'firefox_android',
    'opera_android',
    'qq_android',
    'safari_ios',
    'samsunginternet_android',
    'uc_android',
    'uc_chinese_android',
    'webview_android',
  ],
  server: [
    'nodejs',
  ],
  'webextensions-desktop': [
    'chrome',
    'edge',
    'firefox',
    'opera',
  ],
  'webextensions-mobile': [
    'firefox_android',
  ],
};

/**
 * @param {CompatStatement} compat
 * @param {string[]} displayBrowsers
 * @param {string[]} requiredBrowsers
 * @param {string} category
 * @param {import('../utils').Logger} logger
 * @param {string} path
 */
function processData(compat, displayBrowsers, requiredBrowsers, category, logger, path) {
  if (compat.support) {
    const support = compat.support;

    const invalidEntries = Object.keys(support).filter(value => !displayBrowsers.includes(value));
    if (invalidEntries.length > 0) {
      logger.error(chalk`{red → {bold ${path}} has the following browsers, which are invalid for {bold ${category}} compat data: {bold ${invalidEntries.join(', ')}}}`);
    }

    const missingEntries = requiredBrowsers.filter(value => !(value in support));
    if (missingEntries.length > 0) {
      logger.error(chalk`{red → {bold ${path}} is missing the following browsers, which are required for {bold ${category}} compat data: {bold ${missingEntries.join(', ')}}}`);
    }

    for (const [browser, supportStatement] of Object.entries(support)) {
      const statementList = Array.isArray(supportStatement) ? supportStatement : [supportStatement];
      function hasVersionAddedOnly(statement) {
        const keys = Object.keys(statement);
        return keys.length === 1 && keys[0] === 'version_added';
      }
      let sawVersionAddedOnly = false;
      for (const statement of statementList) {
        if (hasVersionAddedOnly(statement)) {
          if (sawVersionAddedOnly) {
            logger.error(chalk`{red → '{bold ${path}}' has multiple support statement with only \`{bold version_added}\` for {bold ${browser}}}`);
            break;
          } else {
            sawVersionAddedOnly = true;
          }
        }
      }
    }
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testBrowsers(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..', '..'), filename);
  const category = relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
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
  }
  if (category === 'javascript') {
    displayBrowsers.push(...browsers['server']);
  }
  if (category === 'webextensions') {
    displayBrowsers = [...browsers['webextensions-desktop'], ...browsers['webextensions-mobile']];
    requiredBrowsers = browsers['webextensions-desktop'];
  }
  displayBrowsers.sort();
  requiredBrowsers.sort();

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  walkCompatData(data, (compat, { category, path }) => {
    processData(compat, displayBrowsers, requiredBrowsers, category, logger, path);
  });

  if (errors.length) {
    console.error(chalk`{red   Browsers – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testBrowsers;
