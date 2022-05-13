/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const compareVersions = require('compare-versions');
const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 * @typedef {import('../../types').Logger} Logger
 */

const browsers = require('../..').browsers;

/** @type {object.<string, string[]>} */
const validBrowserVersions = {};

/** @type {object.<string, string[]>} */
const VERSION_RANGE_BROWSERS = {
  edge: ['≤18', '≤79'],
  ie: ['≤6', '≤11'],
  opera: ['≤12.1', '≤15'],
  opera_android: ['≤12.1', '≤14'],
  safari: ['≤4'],
  safari_ios: ['≤3'],
  webview_android: ['≤37'],
};

for (const browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
  if (VERSION_RANGE_BROWSERS[browser]) {
    validBrowserVersions[browser].push(...VERSION_RANGE_BROWSERS[browser]);
  }
  if (browsers[browser].preview_name) {
    validBrowserVersions[browser].push('preview');
  }
}

/**
 * Test to see if the browser allows for the specified version
 *
 * @param {string} browser The browser to check
 * @param {VersionValue} version The version to test
 * @returns {boolean} Whether the browser allows that version
 */
function isValidVersion(browserIdentifier, version) {
  if (typeof version === 'string') {
    return validBrowserVersions[browserIdentifier].includes(version);
  } else {
    return true;
  }
}

function hasVersionAddedOnly(statement) {
  const keys = Object.keys(statement);
  return keys.length === 1 && keys[0] === 'version_added';
}

/**
 * Checks if the version number of version_removed is greater than or equal to
 * that of version_added, assuming they are both version strings. If either one
 * is not a valid version string, return null.
 *
 * @param {SimpleSupportStatement} statement
 * @returns {(boolean|null)}
 */
function addedBeforeRemoved(statement) {
  // In order to ensure that the versions could be displayed without the "≤"
  // markers and still make sense, compare the versions without them. This
  // means that combinations like version_added: "≤37" + version_removed: "37"
  // are not allowed, even though this can be technically correct.
  const added = statement.version_added.replace('≤', '');
  const removed = statement.version_removed.replace('≤', '');

  if (!compareVersions.validate(added) || !compareVersions.validate(removed)) {
    return null;
  }

  if (added === 'preview' && removed === 'preview') {
    return false;
  }
  if (added === 'preview' && removed !== 'preview') {
    return false;
  }
  if (added !== 'preview' && removed === 'preview') {
    return true;
  }

  return compareVersions.compare(added, removed, '<');
}

/**
 * Check the data for any errors in provided versions
 *
 * @param {SupportBlock} supportData The data to test
 * @param {string} relPath The path to the data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function checkVersions(supportData, relPath, logger) {
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

      const validBrowserVersionsString = `true, false, null, ${validBrowserVersions[
        browser
      ].join(', ')}`;
      const validBrowserVersionsTruthy = `true, ${validBrowserVersions[
        browser
      ].join(', ')}`;

      let sawVersionAddedOnly = false;

      for (const statement of supportStatements) {
        if (!isValidVersion(browser, statement.version_added)) {
          logger.error(
            chalk`{red → {bold ${relPath}} - {bold version_added: "${statement.version_added}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${validBrowserVersionsString}}`,
          );
        }
        if (!isValidVersion(browser, statement.version_removed)) {
          logger.error(
            chalk`{red → {bold ${relPath}} - {bold version_removed: "${statement.version_removed}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${validBrowserVersionsString}}`,
          );
        }
        if ('version_added' in statement && 'version_removed' in statement) {
          if (statement.version_added === statement.version_removed) {
            logger.error(
              chalk`{red → {bold ${relPath}} - {bold version_added: "${statement.version_added}"} must not be the same as {bold version_removed} for {bold ${browser}}}`,
            );
          }
          if (
            typeof statement.version_added !== 'string' &&
            statement.version_added !== true
          ) {
            logger.error(
              chalk`{red → {bold ${relPath}} - {bold version_added: "${statement.version_added}"} is {bold NOT} a valid version number for {bold ${browser}} when {bold version_removed} is present\n    Valid {bold ${browser}} versions are: ${validBrowserVersionsTruthy}}`,
            );
          } else if (
            typeof statement.version_added === 'string' &&
            typeof statement.version_removed === 'string'
          ) {
            if (addedBeforeRemoved(statement) === false) {
              logger.error(
                chalk`{red → {bold ${relPath}} - {bold version_removed: "${statement.version_removed}"} must be greater than {bold version_added: "${statement.version_added}"}}`,
              );
            }
          }
        }
        if ('flags' in statement) {
          if (browsers[browser].accepts_flags === false) {
            logger.error(
              chalk`{red → {bold ${relPath}} - This browser ({bold ${browser}}) does not support flags, so support cannot be behind a flag for this feature.}`,
            );
          }
        }

        if (hasVersionAddedOnly(statement)) {
          if (sawVersionAddedOnly) {
            logger.error(
              chalk`{red → '{bold ${relPath}}' - {bold ${browser}} has multiple support statements with only {bold version_added}.}`,
            );
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
 * Test for version errors
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
function testVersions(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Versions');

  /**
   * Process the data for version errors
   *
   * @param {Identifier} data The data to test
   * @param {string} relPath The path of the data
   * @returns {void}
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

  logger.emit();
  return logger.hasErrors();
}

module.exports = testVersions;
