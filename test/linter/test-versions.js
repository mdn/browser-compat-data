/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import compareVersions from 'compare-versions';
import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types').SimpleSupportStatement} SimpleSupportStatement
 * @typedef {import('../../types').SupportBlock} SupportBlock
 * @typedef {import('../../types').VersionValue} VersionValue
 * @typedef {import('../../types').Logger} Logger
 */

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

/** @type {Object<string, string>} */
const browserTips = {
  safari_ios:
    'The version numbers for Safari for iOS are based upon the iOS version number rather than the Safari version number. Maybe you are trying to use the desktop version number?',
  opera_android:
    'Blink editions of Opera Android and Opera desktop were the Chrome version number minus 13, up until Opera Android 43 when they began skipping Chrome versions. Please double-check browsers/opera_android.json to make sure you are using the correct versions.',
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

/** @type {string[]} */
const realValuesTargetBrowsers = [
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

/** @type {object.<string, string[]>} */
const realValuesRequired = {
  api: realValuesTargetBrowsers,
  css: realValuesTargetBrowsers,
  html: [],
  http: [],
  svg: [],
  javascript: [...realValuesTargetBrowsers, 'nodejs'],
  mathml: realValuesTargetBrowsers,
  webdriver: realValuesTargetBrowsers,
  webextensions: [],
};

/**
 * Test to see if the browser allows for the specified version
 *
 * @param {string} browser The browser to check
 * @param {string} category The category of the data
 * @param {VersionValue} version The version to test
 * @returns {boolean} Whether the browser allows that version
 */
function isValidVersion(browser, category, version) {
  if (typeof version === 'string') {
    return validBrowserVersions[browser].includes(version);
  } else if (
    realValuesRequired[category].includes(browser) &&
    version !== false
  ) {
    return false;
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
 * @param {string} category The category the data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function checkVersions(supportData, category, logger) {
  const browsersToCheck = Object.keys(supportData);

  for (const browser of browsersToCheck) {
    if (validBrowserVersions[browser]) {
      /** @type {SimpleSupportStatement[]} */
      const supportStatements = Array.isArray(supportData[browser])
        ? supportData[browser]
        : [supportData[browser]];

      let sawVersionAddedOnly = false;

      for (const statement of supportStatements) {
        if (statement === undefined) {
          if (realValuesRequired[category].includes(browser)) {
            logger.error(chalk`{red → {bold ${browser}} must be defined}`);
          }

          continue;
        }

        if (statement === 'mirror') {
          // If the data is to be mirrored, make sure it is mirrorable
          if (!browsers[browser].upstream) {
            logger.error(
              chalk`{bold ${browser}} is set to mirror, however {bold ${browser}} does not have an upstream browser.`,
            );
          }
          continue;
        }

        const statementKeys = Object.keys(statement);

        for (const property of ['version_added', 'version_removed']) {
          const version = statement[property];
          if (property == 'version_removed' && version === undefined) {
            // Undefined is allowed for version_removed
            continue;
          }
          if (!isValidVersion(browser, category, version)) {
            logger.error(
              chalk`{bold ${property}: "${version}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${validBrowserVersions[
                browser
              ].join(', ')}`,
              { tip: browserTips[browser] },
            );
          }
        }

        if ('version_added' in statement && 'version_removed' in statement) {
          if (statement.version_added === statement.version_removed) {
            logger.error(
              chalk`{bold version_added: "${statement.version_added}"} must not be the same as {bold version_removed} for {bold ${browser}}`,
            );
          }
          if (
            typeof statement.version_added === 'string' &&
            typeof statement.version_removed === 'string' &&
            addedBeforeRemoved(statement) === false
          ) {
            logger.error(
              chalk`{bold version_removed: "${statement.version_removed}"} must be greater than {bold version_added: "${statement.version_added}"}`,
            );
          }
        }

        if ('flags' in statement) {
          if (browsers[browser].accepts_flags === false) {
            logger.error(
              chalk`This browser ({bold ${browser}}) does not support flags, so support cannot be behind a flag for this feature.`,
            );
          }
        }

        if (hasVersionAddedOnly(statement)) {
          if (sawVersionAddedOnly) {
            logger.error(
              chalk`{bold ${browser}} has multiple support statements with only {bold version_added}.`,
            );
            break;
          } else {
            sawVersionAddedOnly = true;
          }
        }

        if (statement.version_added === false) {
          if (
            Object.keys(statement).some(
              (k) => !['version_added', 'notes'].includes(k),
            )
          ) {
            logger.error(
              chalk`The data for ({bold ${browser}}) says no support, but contains additional properties that suggest support.`,
            );
          }
        }

        if (
          supportStatements.length > 1 &&
          statement.version_added === false &&
          statementKeys.length == 1 &&
          statementKeys[0] == 'version_added'
        ) {
          logger.error(
            chalk`{bold ${browser}} cannot have a {bold version_added: false} only in an array of statements.`,
          );
        }
      }
    }
  }
}

export default {
  name: 'Versions',
  description: 'Test the version numbers of support statements',
  scope: 'feature',
  check(logger, { data, path: { category } }) {
    checkVersions(data.support, category, logger);
  },
};
