/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compare, validate } from 'compare-versions';
import chalk from 'chalk-template';

import { Linter, Logger, LinterData, twoYearsAgo } from '../utils.js';
import {
  BrowserName,
  SimpleSupportStatement,
  SupportBlock,
  VersionValue,
} from '../../types/types.js';
import {
  InternalSupportBlock,
  InternalSupportStatement,
} from '../../types/index';
import bcd from '../../index.js';
const { browsers } = bcd;

const browserTips: { [browser: string]: string } = {
  nodejs:
    'BCD does not record every individual version of Node.js, only the releases that update V8 engine versions or add a new feature. You may need to add the release to browsers/nodejs.json.',
  safari_ios:
    'The version numbers for Safari for iOS are based upon the iOS version number rather than the Safari version number. Maybe you are trying to use the desktop version number?',
  opera_android:
    'Blink editions of Opera Android and Opera desktop were the Chrome version number minus 13, up until Opera Android 43 when they began skipping Chrome versions. Please double-check browsers/opera_android.json to make sure you are using the correct versions.',
};

const realValuesTargetBrowsers = [
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'firefox_android',
  'opera',
  'opera_android',
  'safari',
  'safari_ios',
  'samsunginternet_android',
  'webview_android',
];

const realValuesRequired: { [category: string]: string[] } = {
  api: realValuesTargetBrowsers,
  css: realValuesTargetBrowsers,
  html: [],
  http: [],
  svg: [],
  javascript: [...realValuesTargetBrowsers, 'nodejs'],
  mathml: realValuesTargetBrowsers,
  webassembly: realValuesTargetBrowsers,
  webdriver: realValuesTargetBrowsers,
  webextensions: [],
};

/**
 * Test to see if the browser allows for the specified version
 * @param {BrowserName} browser The browser to check
 * @param {string} category The category of the data
 * @param {VersionValue} version The version to test
 * @returns {boolean} Whether the browser allows that version
 */
const isValidVersion = (
  browser: BrowserName,
  category: string,
  version: VersionValue,
): boolean => {
  if (typeof version === 'string') {
    if (version === 'preview') {
      return !!browsers[browser].preview_name;
    }
    return Object.hasOwn(browsers[browser].releases, version.replace('≤', ''));
  } else if (
    realValuesRequired[category].includes(browser) &&
    version !== false
  ) {
    return false;
  }
  return true;
};

/**
 * Checks if the version number of version_removed is greater than or equal to
 * that of version_added, assuming they are both version strings. If either one
 * is not a valid version string, return null.
 * @param {SimpleSupportStatement} statement The statement to test
 * @returns {(boolean|null)} Whether the version added was earlier than the version removed
 */
const addedBeforeRemoved = (
  statement: SimpleSupportStatement,
): boolean | null => {
  if (
    typeof statement.version_added !== 'string' ||
    typeof statement.version_removed !== 'string'
  ) {
    return false;
  }

  // In order to ensure that the versions could be displayed without the "≤"
  // markers and still make sense, compare the versions without them. This
  // means that combinations like version_added: "≤37" + version_removed: "37"
  // are not allowed, even though this can be technically correct.
  const added = statement.version_added.replace('≤', '');
  const removed = statement.version_removed.replace('≤', '');

  if (!validate(added) || !validate(removed)) {
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

  return compare(added, removed, '<');
};

/**
 * Check the data for any errors in provided versions
 * @param {SupportBlock} supportData The data to test
 * @param {string} category The category the data
 * @param {Logger} logger The logger to output errors to
 */
const checkVersions = (
  supportData: InternalSupportBlock,
  category: string,
  logger: Logger,
): void => {
  const browsersToCheck = Object.keys(browsers).filter((b) =>
    category === 'webextensions' ? browsers[b].accepts_webextensions : !!b,
  ) as BrowserName[];

  for (const browser of browsersToCheck) {
    const supportStatement: InternalSupportStatement | undefined =
      supportData[browser];

    if (!supportStatement) {
      if (realValuesRequired[category].includes(browser)) {
        logger.error(chalk`{red {bold ${browser}} must be defined}`);
      }

      continue;
    }

    for (const statement of Array.isArray(supportStatement)
      ? supportStatement
      : [supportStatement]) {
      if (statement === 'mirror') {
        // If the data is to be mirrored, make sure it is mirrorable
        if (!browsers[browser].upstream) {
          logger.error(
            chalk`{bold ${browser}} is set to mirror, however {bold ${browser}} does not have an upstream browser.`,
          );
        }
        continue;
      }

      for (const property of ['version_added', 'version_removed']) {
        const version = statement[property];
        if (property == 'version_removed' && version === undefined) {
          // version_removed is optional.
          continue;
        }
        if (!isValidVersion(browser, category, version)) {
          logger.error(
            chalk`{bold ${property}: "${version}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Valid {bold ${browser}} versions are: ${Object.keys(
              browsers[browser].releases,
            ).join(', ')}`,
            { tip: browserTips[browser] },
          );
        }

        if (typeof version === 'string' && version.startsWith('≤')) {
          const releaseData =
            browsers[browser].releases[version.replace('≤', '')];
          if (
            !releaseData ||
            !releaseData.release_date ||
            new Date(releaseData.release_date) > twoYearsAgo
          ) {
            logger.error(
              chalk`{bold ${property}: "${version}"} is {bold NOT} a valid version number for {bold ${browser}}\n    Ranged values are only allowed for browser versions released two years or earlier (on or before ${twoYearsAgo}). Ranged values are also not allowed for browser versions without a known release date.`,
            );
          }
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

      if ('flags' in statement && !browsers[browser].accepts_flags) {
        logger.error(
          chalk`This browser ({bold ${browser}}) does not support flags, so support cannot be behind a flag for this feature.`,
        );
      }

      if (statement.version_added === false) {
        if (
          Object.keys(statement).some(
            (k) => !['version_added', 'notes', 'impl_url'].includes(k),
          )
        ) {
          logger.error(
            chalk`The data for ({bold ${browser}}) says no support, but contains additional properties that suggest support.`,
          );
        }
      }

      if (
        Array.isArray(supportStatement) &&
        statement.version_added === false
      ) {
        logger.error(
          chalk`{bold ${browser}} cannot have a {bold version_added: false} in an array of statements.`,
        );
      }
    }
  }
};

export default {
  name: 'Versions',
  description: 'Test the version numbers of support statements',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    checkVersions(data.support, category, logger);
  },
} as Linter;
