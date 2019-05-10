'use strict';
const path = require('path');
const chalk = require('chalk');

/**
 * @typedef {import('../types').Identifier} Identifier
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
    'edge_mobile',
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
 * @param {Identifier} data
 * @param {string[]} displayBrowsers
 * @param {string[]} requiredBrowsers
 * @param {string} category
 * @param {{error:function(...unknown):void}} logger
 * @param {string} [path]
 * @returns {boolean}
 */
function processData(data, displayBrowsers, requiredBrowsers, category, logger, path = '') {
  let hasErrors = false;
  if (data.__compat && data.__compat.support) {
    const invalidEntries = Object.keys(data.__compat.support).filter(value => !displayBrowsers.includes(value));
    if (invalidEntries.length > 0) {
      logger.error(chalk`{red.bold ${path}}{red  has the following browsers, which are invalid for }{red.bold ${category}}{red  compat data: }{red.bold ${invalidEntries.join(', ')}}`);
      hasErrors = true;
    }
    const missingEntries = requiredBrowsers.filter(value => !(value in data.__compat.support));
    if (missingEntries.length > 0) {
      logger.error(chalk`{red.bold ${path}}{red  is missing the following browsers, which are required for }{red.bold ${category}}{red  compat data: }{red.bold ${missingEntries.join(', ')}}`);
      hasErrors = true;
    }
  }
  for (const key in data) {
    if (key === "__compat") continue;
    // Note that doing `hasErrors |= processData(…)` would convert
    // `hasErrors` into a number, which could potentially lead
    // to unexpected issues down the line.

    // We can't use the ESNext `hasErrors ||= processData(…)` here either,
    // as that would prevent printing nested browser issues, making testing
    // and fixing issues longer, as nested issues wouldn't be logged.
    hasErrors = processData(
      data[key],
      displayBrowsers,
      requiredBrowsers,
      category,
      logger,
      (path && path.length > 0)
        ? `${path}.${key}`
        : key,
    ) || hasErrors;
  }
  return hasErrors;
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testBrowsers(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filename);
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

  processData(data, displayBrowsers, requiredBrowsers, category, logger);

  if (errors.length) {
    console.error(chalk`{red   Browsers – }{red.bold ${errors.length}}{red  ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testBrowsers;
