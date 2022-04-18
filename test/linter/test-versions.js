'use strict';

const compareVersions = require('compare-versions');
const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 */
const browsers = require('../..').browsers;

/** @type {Object<string, string[]>} */
const validBrowserVersions = {};

/** @type {Object<string, string[]>} */
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
 * @param {SimpleSupportStatement} statement
 * @returns {boolean|null}
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
 * @param {SupportBlock} supportData
 * @param {string} relPath
 * @param {Logger} logger
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
      }
    }
  }
}

/**
 * @param {string} filename
 */
function testVersions(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Versions');

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

  logger.emit();
  return logger.hasErrors();
}

module.exports = testVersions;
