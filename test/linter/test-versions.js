'use strict';
const compareVersions = require('compare-versions');
const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 */
const browsers = require('../../browsers');

/** @type {Object<string, string[]>} */
const validBrowserVersions = {};

/** @type {Object<string, string[]>} */
const VERSION_RANGE_BROWSERS = {
  webview_android: ['≤37'],
};

for (const browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
  if (VERSION_RANGE_BROWSERS[browser]) {
    validBrowserVersions[browser].push(...VERSION_RANGE_BROWSERS[browser]);
  }
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
 * @param {import('../utils').Logger} logger
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
          logger.error(chalk`{red {bold ${relPath}} - {bold version_added: "${statement.version_added}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${validBrowserVersionsString}}`);
          hasErrors = true;
        }
        if (!isValidVersion(browser, statement.version_removed)) {
          logger.error(chalk`{red {bold ${relPath}} - {bold version_removed: "${statement.version_removed}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${validBrowserVersionsString}}`);
          hasErrors = true;
        }
        if ('version_removed' in statement && 'version_added' in statement) {
          if (
            typeof statement.version_added !== 'string' &&
            statement.version_added !== true
          ) {
            logger.error(chalk`{red {bold ${relPath}} - {bold version_added: "${statement.version_added}"} is {bold NOT} a valid version number for {bold ${browser}} when {bold version_removed} is present\n    Valid {bold ${browser}} versions are: ${validBrowserVersionsTruthy}}`);
            hasErrors = true;
          } else if (typeof statement.version_added === 'string' && typeof statement.version_removed === 'string') {
            if (
              (
                statement.version_added.startsWith("≤") && statement.version_removed.startsWith("≤") &&
                compareVersions.compare(statement.version_added.replace("≤", ""), statement.version_removed.replace("≤", ""), "<")
              ) || (
                (!statement.version_added.startsWith("≤") || !statement.version_removed.startsWith("≤")) &&
                compareVersions.compare(statement.version_added.replace("≤", ""), statement.version_removed.replace("≤", ""), ">=")
              )
            ) {
              logger.error(chalk`{red {bold ${relPath}} - {bold version_removed: "${statement.version_removed}"} must be greater than {bold version_added: "${statement.version_added}"}}`);
              hasErrors = true;
            }
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
   * @param {string} [relPath]
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
    console.error(chalk`{red   Versions – {bold ${errors.length}} ${errors.length === 1 ? 'error' : 'errors'}:}`);
    for (const error of errors) {
      console.error(`    ${error}`);
    }
    return true;
  }
  return false;
}

module.exports = testVersions;
