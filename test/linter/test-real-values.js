'use strict';
const path = require('path');
const chalk = require('chalk');

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

/** @type {Record<string, string[]>} */
const blockList = {
  api: [],
  css: blockMany,
  html: [],
  http: [],
  svg: [],
  javascript: blockMany,
  mathml: blockMany,
  webdriver: blockMany,
  webextensions: [],
  xpath: [],
  xslt: [],
};

/**
 * @param {SupportBlock} supportData
 * @param {string[]} blockList
 * @param {string} relPath
 * @param {Logger} logger
 */
const checkRealValues = (supportData, blockList, relPath, logger) => {
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
          chalk`{red → {bold ${browser}} must be defined for {bold ${relPath}}}`,
        );
      } else {
        if ([true, null].includes(statement.version_added)) {
          logger.error(
            chalk`{red → {bold ${relPath}} - {bold ${browser}} no longer accepts {bold ${statement.version_added}} as a value}`,
          );
        }
        if ([true, null].includes(statement.version_removed)) {
          logger.error(
            chalk`{red → {bold ${relPath}} - {bold ${browser}} no longer accepts} {bold ${statement.version_removed}} as a value}`,
          );
        }
      }
    }
  }
};

/**
 * @param {Identifier} data
 * @param {string} [relPath]
 */
const findSupport = (data, category, logger, relPath) => {
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
};

/**
 * @param {string} filename
 */
const testRealValues = filename => {
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
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

  findSupport(data, category, logger);

  if (errors.length) {
    console.error(
      chalk`{red   Real values – {bold ${errors.length}} ${
        errors.length === 1 ? 'error' : 'errors'
      }:}`,
    );
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    return true;
  }
  return false;
};

module.exports = testRealValues;
