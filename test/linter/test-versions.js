'use strict';
const path = require('path');
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

/** @type string[] */
const FLAGLESS_BROWSERS = ['samsunginternet_android', 'webview_android'];

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
  javascript: [...blockMany, 'nodejs'],
  mathml: blockMany,
  webdriver: blockMany,
  webextensions: [],
};

/**
 * @param {string} browserIdentifier
 * @param {VersionValue} version
 */
function isValidVersion(browser, category, version) {
  if (typeof version === 'string') {
    return validBrowserVersions[browser].includes(version);
  } else if (blockList[category].includes(browser) && version !== false) {
    return false;
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
function checkVersions(supportData, category, relPath, logger) {
  const browsersToCheck = Object.keys(supportData);
  for (const browser of browsersToCheck) {
    if (validBrowserVersions[browser]) {
      /** @type {SimpleSupportStatement[]} */
      const supportStatements = Array.isArray(supportData[browser])
        ? supportData[browser]
        : [supportData[browser]];

      for (const statement of supportStatements) {
        if (statement === undefined) {
          if (blockList[category].includes(browser)) {
            logger.error(
              chalk`{red → {bold ${browser}} must be defined for {bold ${relPath}}}`,
            );
          }
        } else {
          if (!isValidVersion(browser, category, statement.version_added)) {
            logger.error(
              chalk`{red → {bold ${relPath}} - {bold version_added: "${
                statement.version_added
              }"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${
                blockList[category].includes(browser)
                  ? `false, ${validBrowserVersions[browser].join(', ')}`
                  : `true, false, null, ${validBrowserVersions[browser].join(
                      ', ',
                    )}`
              }}`,
            );
          }
          if ('version_added' in statement && 'version_removed' in statement) {
            if (statement.version_added === statement.version_removed) {
              logger.error(
                chalk`{red → {bold ${relPath}} - {bold version_added: "${statement.version_added}"} must not be the same as {bold version_removed} for {bold ${browser}}}`,
              );
            }
            if (
              'version_removed' in statement &&
              !isValidVersion(browser, category, statement.version_removed)
            ) {
              logger.error(
                chalk`{red → {bold ${relPath}} - {bold version_removed: "${
                  statement.version_removed
                }"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${
                  blockList[category].includes(browser)
                    ? `false, ${validBrowserVersions[browser].join(', ')}`
                    : `true, false, null, ${validBrowserVersions[browser].join(
                        ', ',
                      )}`
                }}`,
              );
            } else if (
              typeof statement.version_added === 'string' &&
              typeof statement.version_removed === 'string' &&
              addedBeforeRemoved(statement) === false
            ) {
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
  const relativePath = path.relative(
    path.resolve(__dirname, '..', '..'),
    filename,
  );
  const category =
    relativePath.includes(path.sep) && relativePath.split(path.sep)[0];
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
        checkVersions(data[prop].support, category, relPath, logger);
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
