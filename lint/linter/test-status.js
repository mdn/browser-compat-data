/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {BrowserName, CompatStatement} from '../../types/types.js' */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load exception list for standard_track features without spec_url
const exceptionListPath = join(
  __dirname,
  '../common/standard-track-exceptions.txt',
);
const standardTrackExceptions = new Set(
  readFileSync(exceptionListPath, 'utf-8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#')),
);

// See: https://github.com/web-platform-dx/web-features/blob/main/docs/baseline.md#core-browser-set
const CORE_BROWSER_SET = new Set([
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'firefox_android',
  'safari',
  'safari_ios',
]);

/**
 * Check if experimental should be true or false
 * @param {CompatStatement} data The data to check
 * @returns {boolean} The expected experimental status
 */
export const checkExperimental = (data) => {
  if (data.status?.experimental) {
    // Check if experimental should be false (code copied from migration 007)

    /** @type {Set<BrowserName>} */
    const browserSupport = new Set();

    for (const [browser, support] of Object.entries(data.support)) {
      if (!CORE_BROWSER_SET.has(browser)) {
        continue;
      }
      // Consider only the first part of an array statement.
      const statement = Array.isArray(support) ? support[0] : support;
      // Ignore anything behind flag, prefix or alternative name
      if (statement.flags || statement.prefix || statement.alternative_name) {
        continue;
      }
      if (statement.version_added && !statement.version_removed) {
        if (statement.version_added !== 'preview') {
          browserSupport.add(/** @type {BrowserName} */ (browser));
        }
      }
    }

    // Now check which of Blink, Gecko and WebKit support it.

    const engineSupport = new Set();

    for (const browser of browserSupport) {
      const currentRelease = Object.values(browsers[browser].releases).find(
        (r) => r.status === 'current',
      );
      const engine = currentRelease?.engine;
      if (engine) {
        engineSupport.add(engine);
      }
    }

    let engineCount = 0;
    for (const engine of ['Blink', 'Gecko', 'WebKit']) {
      if (engineSupport.has(engine)) {
        engineCount++;
      }
    }

    if (engineCount > 1) {
      return false;
    }
  }

  return true;
};

/**
 * Check the status blocks of the compat date
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} category The feature category
 * @param {string} featurePath The full path to the feature (e.g., "api.Animation.remove_filling_animation")
 * @returns {void}
 */
const checkStatus = (data, logger, category, featurePath) => {
  const status = data.status;

  if (!status) {
    return;
  } else if (category === 'webextensions') {
    logger.error(
      chalk`{red Has a {bold status object}, which is {bold not allowed} for web extensions.}`,
    );
  }

  if (status.experimental && status.deprecated) {
    logger.error(
      chalk`{red Unexpected simultaneous {bold experimental} and {bold deprecated} status}`,
      { fixable: true },
    );
  }

  if (data.spec_url && status.standard_track === false) {
    logger.error(
      chalk`{red Marked as {bold non-standard}, but has a {bold spec_url}}`,
    );
  }

  // Check for standard_track without spec_url
  const isInExceptionList = standardTrackExceptions.has(featurePath);
  const missingSpecUrl = !data.spec_url && status.standard_track === true;

  if (missingSpecUrl && !isInExceptionList) {
    // New violation - not in baseline exception list
    logger.error(
      chalk`{red Marked as {bold standard_track}, but missing required {bold spec_url}}`,
    );
  }

  // Warn if exception no longer applies
  if (isInExceptionList && !missingSpecUrl) {
    logger.warning(
      chalk`{yellow Feature is in the exception list but no longer needs to be (spec_url was added or standard_track is false). Remove from {bold standard-track-exceptions.txt}}`,
      { fixable: true },
    );
  }

  if (!checkExperimental(data)) {
    logger.error(
      chalk`{red {bold Experimental} should be set to {bold false} as the feature is {bold supported} in {bold multiple browser} engines.}`,
      { fixable: true },
    );
  }
};

/** @type {Linter} */
export default {
  name: 'Status',
  description: 'Test the status of support statements',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category, full } }) => {
    checkStatus(/** @type {CompatStatement} */ (data), logger, category, full);
  },
};
