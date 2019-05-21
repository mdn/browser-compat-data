'use strict';
const path = require('path');
const compareVersions = require('compare-versions');
const chalk = require('chalk');

/**
 * @typedef {import('../types').Identifier} Identifier
 * @typedef {import('../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../types').SupportBlock} SupportBlock
 * @typedef {import('../types').VersionValue} VersionValue
 */
const browsers = require('..').browsers;

/** @type {Object<string, string[]>} */
const validBrowserVersions = {};
for (const browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
}

/**
 * @param {string} browserIdentifier
 * @param {VersionValue} version
 */
function isValidVersion(browserIdentifier, version) {
  if (typeof version === 'string') {
    return validBrowserVersions[browserIdentifier].includes(version);
  } else {
    return true;
  }
}

/**
 * @param {SupportBlock} supportData
 * @param {string} relPath
 * @param {{error:function(...unknown):void}} logger
 */
function checkVersions(supportData, relPath, logger) {
  let hasErrors = false;
  const browsersToCheck = Object.keys(supportData);
  for (const browser of browsersToCheck) {
    if (validBrowserVersions[browser]) {
      /** @type {SimpleSupportStatement[]} */
      const supportStatements = [];
      if (Array.isArray(supportData[browser])) {
        Array.prototype.push.apply(supportStatements, supportData[browser]);
      } else {
        supportStatements.push(supportData[browser]);
      }

      const validBrowserVersionsString = `true, false, null, ${validBrowserVersions[browser].join(', ')}`;
      const validBrowserVersionsTruthy = `true, ${validBrowserVersions[browser].join(', ')}`;

      for (const statement of supportStatements) {
        if (!isValidVersion(browser, statement.version_added)) {
          logger.error(chalk`{red.bold ${relPath}} {red -} {red.bold version_added: "${statement.version_added}"}{red  is }{red.bold NOT}{red  a valid version number for }{red.bold ${browser}}\n    {red Valid }{red.bold ${browser}}{red  versions are: ${validBrowserVersionsString}}`);
          hasErrors = true;
        }
        if (!isValidVersion(browser, statement.version_removed)) {
          logger.error(chalk`{red.bold ${relPath}} {red -} {red.bold version_removed: "${statement.version_removed}"}{red  is }{red.bold NOT}{red  a valid version number for }{red.bold ${browser}}\n    {red Valid }{red.bold ${browser}}{red  versions are: ${validBrowserVersionsString}}`);
          hasErrors = true;
        }
        if ('version_removed' in statement && 'version_added' in statement) {
          if (
            typeof statement.version_added !== 'string' &&
            statement.version_added !== true
          ) {
            logger.error(chalk`{red.bold ${relPath}} {red -} {red.bold version_added: "${statement.version_added}"}{red  is }{red.bold NOT}{red  a valid version number for }{red.bold ${browser}}{red  when }{red.bold version_removed}{red  is present}\n    {red Valid }{red.bold ${browser}}{red  versions are: ${validBrowserVersionsTruthy}}`);
            hasErrors = true;
          } else if (
            typeof statement.version_added === 'string' &&
            typeof statement.version_removed === 'string' &&
            compareVersions(statement.version_added, statement.version_removed) >= 0
          ) {
            logger.error(chalk`{red.bold ${relPath}} {red -} {red.bold version_removed: "${statement.version_removed}"}{red  must be greater than }{red.bold version_added: "${statement.version_added}"}`);
            hasErrors = true;
          }
        }
      }
    }
  }

  return hasErrors;
}

/**
 * @param {string} filename
 */
function testVersions(filename) {
  const relativePath = path.relative(path.resolve(__dirname, '..'), filename);
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
   * @param {string} relPath
   */
  function findSupport(data, relPath) {
    for (const prop in data) {
      if (prop === '__compat' && data[prop].support) {
        checkVersions(data[prop].support, relPath, logger);
      }
      const sub = data[prop];
      if (typeof sub === 'object') {
        findSupport(sub, relPath ? `${relPath}.${prop}` : `${prop}`);
      }
    }
  }
  findSupport(data);

  if (errors.length) {
    console.error(chalk`{red   Versions – }{red.bold ${errors.length}}{red  ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testVersions;
