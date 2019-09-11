'use strict';
const path = require('path');
const chalk = require('chalk');
const { walkCompatData } = require('../utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
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
  'webview_android'
];

/** @type {Record<string, string[]>} */
const blockList = {
  api: [],
  css: ['chrome', 'chrome_android', 'edge', 'firefox', 'firefox_android',
        'ie', 'safari', 'safari_ios', 'webview_android'],
  html: [],
  http: [],
  svg: [],
  javascript: ['edge', 'firefox', 'firefox_android', 'ie'],
  mathml: blockMany,
  webdriver: blockMany,
  webextensions: [],
  xpath: [],
  xslt: []
};

/**
 * @param {SupportBlock} supportData
 * @param {string[]} blockList
 * @param {string} relPath
 * @param {import('../utils').Logger} logger
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
        logger.error(chalk`{red → {bold ${browser}} must be defined for {bold ${relPath}}}`);
      } else {
        if ([true, null].includes(statement.version_added)) {
          logger.error(chalk`{red → {bold ${relPath}} - {bold ${browser}} no longer accepts {bold ${statement.version_added}} as a value}`);
        }
        if ([true, null].includes(statement.version_removed)) {
          logger.error(chalk`{red → {bold ${relPath}} - {bold ${browser}} no longer accepts} {bold ${statement.version_removed}} as a value}`);
        }
      }
    }
  }
}

/**
 * @param {string} filename
 */
function testRealValues(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..', '..'), filename);
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /** @param {...unknown} message */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  walkCompatData(data, (compat, { category, path }) => {
    let bl = blockList[category];
    if (compat.support && bl && bl.length > 0) {
      checkRealValues(compat.support, bl, path, logger);
    }
  });

  if (errors.length) {
    console.error(chalk`{red   Real values – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testRealValues;
