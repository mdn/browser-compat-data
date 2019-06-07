'use strict';
const compareVersions = require('compare-versions');
const chalk = require('chalk');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 *
 * @typedef {{ [browser: string]: string[] }} ValidBrowserVersions
 */
const browsers = require('../..').browsers;

/** @type {{ [category: string]: ValidBrowserVersions }} */
const categoryBrowserVersions = {};

/** @type {ValidBrowserVersions} */
const validBrowserVersions = {};

/** @type {Object<string, string[]>} */
const VERSION_RANGE_BROWSERS = {
  webview_android: ['≤37'],
  opera: ['≤12.1', '≤15'],
  opera_android: ['≤12.1', '≤14'],
  edge: ['≤18', '≤79'],
};

/** @type string[] */
const FLAGLESS_BROWSERS = ['samsunginternet_android', 'webview_android'];

for (const browser of Object.keys(browsers)) {
  const { releases } = browsers[browser];
  validBrowserVersions[browser] = Object.keys(releases);

  if (browser === 'nodejs') {
    const specialVersions = [
      // '8.5.0' is special, as it introduced experimental module support.
      '8.5.0',
      // '13.0.0' is special, as it completed I18n support
      // and introduced experimental WeakRef support.
      '13.0.0',
    ];
    /** @type {{[v8Version: string]: string}} */
    const v8Versions = {};
    for (const browserVersion of Object.keys(releases)) {
      const release = releases[browserVersion];
      if (release.engine !== 'V8' || !release.engine_version) {
        specialVersions.push(browserVersion);
      }
      if (!(release.engine_version in v8Versions)) {
        v8Versions[release.engine_version] = browserVersion;
      } else {
        let currentVersion = v8Versions[release.engine_version];
        if (
          currentVersion.localeCompare(browserVersion, [], { numeric: true }) >
          0
        ) {
          v8Versions[release.engine_version] = browserVersion;
        }
      }
    }

    const versions = new Set(specialVersions.concat(Object.values(v8Versions)));
    if (!categoryBrowserVersions.javascript) {
      categoryBrowserVersions.javascript = {};
    }
    categoryBrowserVersions.javascript[browser] = Array.from(
      versions,
    ).sort((a, b) => a.localeCompare(b, [], { numeric: true }));
  }

  if (VERSION_RANGE_BROWSERS[browser]) {
    validBrowserVersions[browser].push(...VERSION_RANGE_BROWSERS[browser]);
  }
}

/**
 * @param {string} browser
 * @param {VersionValue} version
 * @param {string} category
 */
function isValidVersion(browser, version, category) {
  if (typeof version === 'string') {
    return getValidBrowserVersions(browser, category).includes(version);
  } else {
    return true;
  }
}

/**
 * @param {string} browser
 * @param {string} category
 * @return {string[] | undefined}
 */
function getValidBrowserVersions(browser, category) {
  return categoryBrowserVersions[category] &&
    categoryBrowserVersions[category][browser]
    ? categoryBrowserVersions[category][browser]
    : validBrowserVersions[browser];
}

/**
 * @param {SupportBlock} supportData
 * @param {string} relPath
 * @param {string} category
 * @param {import('../utils').Logger} logger
 */
function checkVersions(supportData, relPath, category, logger) {
  const browsersToCheck = Object.keys(supportData);
  for (const browser of browsersToCheck) {
    const validVersions = getValidBrowserVersions(browser, category);
    if (validVersions) {
      /** @type {SimpleSupportStatement[]} */
      const supportStatements = [];
      if (Array.isArray(supportData[browser])) {
        Array.prototype.push.apply(supportStatements, supportData[browser]);
      } else {
        supportStatements.push(supportData[browser]);
      }

      const validBrowserVersionsString = `true, false, null, ${validVersions.join(
        ', ',
      )}`;
      const validBrowserVersionsTruthy = `true, ${validVersions.join(', ')}`;
      const hasCategorySpecificData = Boolean(
        categoryBrowserVersions[category] &&
          categoryBrowserVersions[category][browser],
      );

      for (const statement of supportStatements) {
        if (!isValidVersion(browser, statement.version_added, category)) {
          logger.error(
            chalk`{red {bold ${relPath}} - {bold version_added: "${
              statement.version_added
            }"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions ${
              hasCategorySpecificData ? chalk`for {bold ${category}} ` : ''
            }are: ${validBrowserVersionsString}}`,
          );
        }
        if (!isValidVersion(browser, statement.version_removed, category)) {
          logger.error(
            chalk`{red {bold ${relPath}} - {bold version_removed: "${
              statement.version_removed
            }"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions ${
              hasCategorySpecificData ? chalk`for {bold ${category}} ` : ''
            }are: ${validBrowserVersionsString}}`,
          );
        }
        if ('version_removed' in statement && 'version_added' in statement) {
          if (
            typeof statement.version_added !== 'string' &&
            statement.version_added !== true
          ) {
            logger.error(
              chalk`{red {bold ${relPath}} - {bold version_added: "${
                statement.version_added
              }"} is {bold NOT} a valid version number for {bold ${browser}} when {bold version_removed} is present\n    Valid {bold ${browser}} versions ${
                hasCategorySpecificData ? chalk`for {bold ${category}} ` : ''
              }are: ${validBrowserVersionsTruthy}}`,
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
   * @param {string} [category]
   */
  function findSupport(data, relPath, category) {
    for (const prop in data) {
      if (prop === '__compat' && data[prop].support) {
        checkVersions(data[prop].support, relPath, category, logger);
      }
      const sub = data[prop];
      if (typeof sub === 'object') {
        findSupport(
          sub,
          relPath ? `${relPath}.${prop}` : `${prop}`,
          category ? category : prop,
        );
      }
    }
  }
  findSupport(data);

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
}

module.exports = testVersions;
