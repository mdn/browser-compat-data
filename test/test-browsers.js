'use strict';
const fs = require('fs');
const path = require('path');

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

function processData(data, browsers, category, logger, path = '') {
  let hasErrors = false;
  if (data.__compat && data.__compat.support) {
    const invalidEntries = Object.keys(data.__compat.support).filter(value => !browsers.includes(value));
    if (invalidEntries.length > 0) {
      logger.error(`'${path}' has the following browesers, which are invalid for ${category}: ${invalidEntries.join(', ')}`);
      hasErrors = true;
    }
  }
  for (const key in data) {
    if (key === "__compat") continue;
    hasErrors |= processData(data[key], browsers, category, logger, (path && path.length > 0) ? `${path}.${key}` : key);
  }
  return hasErrors;
}

function testBrowsers(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filename);
  const category = (/^(?:\.[\/\\])?([^\/\\]+)/.exec(relativePath) || [])[1];
  const data = require(filename);

  if (!category) {
    console.log('\x1b[1;30m  Browsers – Unknown \x1b[0m');
    return false;
  }

  let bcCategory = 'web';
  let displayBrowers = [...browsers['desktop'], ...browsers['mobile']];
  if (category === 'javascript') {
    bcCategory = 'js';
    displayBrowers.push(...browsers['server']);
  }
  if (category === 'webextensions') {
    bcCategory = 'ext';
    displayBrowers = [...browsers['webextensions-desktop'], ...browsers['webextensions-mobile']];
  }
  displayBrowers.sort();

  /** @type {string[]} */
  const errors = [];
  const logger = {
    error: (message) => {errors.push(message);}
  }

  if (!processData(data, displayBrowers, bcCategory === 'web' ? bcCategory : category, logger)) {
    return false;
  } else {
    console.error('\x1b[31m  Browsers –', errors.length, 'error(s):\x1b[0m');
    for (let error of errors)
      console.error(`    ${error}`);
    return true;
  }
}

module.exports.testBrowsers = testBrowsers;
