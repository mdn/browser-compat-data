/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const compareVersions = require('compare-versions');
const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 * @typedef {import('../utils').Logger} Logger
 */
const browsers = require('../..').browsers;

/** @type {object<string, string[]>} */
const validBrowserVersions = {};

/** @type {object<string, string[]>} */
const VERSION_RANGE_BROWSERS = {
  webview_android: ['≤37'],
  edge: ['≤18', '≤79'],
};

/** @type {string[]} */
const FLAGLESS_BROWSERS = ['webview_android'];

for (const browser of Object.keys(browsers)) {
  validBrowserVersions[browser] = Object.keys(browsers[browser].releases);
  if (VERSION_RANGE_BROWSERS[browser]) {
    validBrowserVersions[browser].push(...VERSION_RANGE_BROWSERS[browser]);
  }
}

/**
 * Test to see if the browser allows for the specified version
 *
 * @param {string} browser The browser to check
 * @param {VersionValue} version The version to test
 * @returns {boolean} Whether the browser allows that version
 */
const isValidVersion = (browser, version) => {
  if (typeof version === 'string') {
    return validBrowserVersions[browser].includes(version);
  } else {
    return true;
  }
};

/**
 * Check the data for any errors in provided versions
 *
 * @param {SupportBlock} supportData The data to test
 * @param {string} relPath The path to the data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkVersions = (supportData, relPath, logger) => {
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
        if ('version_removed' in statement && 'version_added' in statement) {
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
            if (
              (statement.version_added.startsWith('≤') &&
                statement.version_removed.startsWith('≤') &&
                compareVersions.compare(
                  statement.version_added.replace('≤', ''),
                  statement.version_removed.replace('≤', ''),
                  '<',
                )) ||
              ((!statement.version_added.startsWith('≤') ||
                !statement.version_removed.startsWith('≤')) &&
                compareVersions.compare(
                  statement.version_added.replace('≤', ''),
                  statement.version_removed.replace('≤', ''),
                  '>=',
                ))
            ) {
              logger.error(
                chalk`{red → {bold ${relPath}} - {bold version_removed: "${statement.version_removed}"} must be greater than {bold version_added: "${statement.version_added}"}}`,
              );
            }
          }
        }
        if ('flags' in statement) {
          if (FLAGLESS_BROWSERS.includes(browser)) {
            logger.error(
              chalk`{red → {bold ${relPath}} - This browser ({bold ${browser}}) does not support flags, so support cannot be behind a flag for this feature.}`,
            );
          }
        }
      }
    }
  }
};

/**
 * Process the data for version errors
 *
 * @param {Identifier} data The data to test
 * @param {Logger} logger The logger to ouptut errors to
 * @param {string} [relPath] The path of the data
 * @returns {void}
 */
const findSupport = (data, logger, relPath) => {
  for (const prop in data) {
    if (prop === '__compat' && data[prop].support) {
      checkVersions(data[prop].support, relPath, logger);
    }
    const sub = data[prop];
    if (typeof sub === 'object') {
      findSupport(sub, logger, relPath ? `${relPath}.${prop}` : `${prop}`);
    }
  }
};

/**
 * Test for version errors
 *
 * @param {string} filename The file to test
 * @returns {boolean} If the file contains errors
 */
const testVersions = filename => {
  /** @type {Identifier} */
  const data = require(filename);

  /** @type {string[]} */
  const errors = [];
  const logger = {
    /**
     * logger.error
     *
     * @param {...*} message Messages to add to errors
     */
    error: (...message) => {
      errors.push(message.join(' '));
    },
  };

  findSupport(data, logger);

  if (errors.length) {
    console.error(
      chalk`{red   Versions – {bold ${errors.length}} ${
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

module.exports = testVersions;
