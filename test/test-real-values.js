'use strict';
const path = require('path');
const compareVersions = require('compare-versions');
const chalk = require('chalk');

/** @type {Record<string, string[]>} */
const browsers = {
  api: [],
  css: ['ie'],
  html: [],
  http: [],
  svg: [],
  javascript: [],
  mathml: [],
  webdriver: [],
  webextensions: [],
  xpath: [],
  xslt: []
};

/**
 * @param {SupportBlock} supportData
 * @param {{error:function(...unknown):void}} logger
 */
function checkRealValues(supportData, browsers, logger) {
  let hasErrors = false;
  const browsersToCheck = Object.keys(supportData);
  for (const browser of browsersToCheck) {
    if (browsers.includes(browser)) {
      /** @type {SimpleSupportStatement[]} */
      const supportStatements = [];
      if (Array.isArray(supportData[browser])) {
        Array.prototype.push.apply(supportStatements, supportData[browser]);
      } else {
        supportStatements.push(supportData[browser]);
      }

      for (const statement of supportStatements) {
        if ([true, null].includes(statement.version_added)) {
          logger.error(chalk`{red.bold ${browser}} {red no longer accepts} {red.bold ${statement.version_added}} {red as a value}`);
          hasErrors = true;
        }
        if ([true, null].includes(statement.version_removed)) {
          logger.error(chalk`{red.bold ${browser}} {red no longer accepts} {red.bold ${statement.version_removed}} {red as a value}`);
          hasErrors = true;
        }
      }
    }
  }

  return hasErrors;
}

/**
 * @param {string} filename
 */
function testRealValues(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filename);
  const category = relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
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

  /**
   * @param {Identifier} data
   */
  function findSupport(data) {
    for (const prop in data) {
      if (prop === '__compat' && data[prop].support) {
        if (browsers[category] && browsers[category].length > 0) checkRealValues(data[prop].support, browsers[category], logger);
      }
      const sub = data[prop];
      if (typeof sub === 'object') {
        findSupport(sub);
      }
    }
  }
  findSupport(data);

  if (errors.length) {
    console.error(chalk`{red   Real values – }{red.bold ${errors.length}}{red  ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testRealValues;
