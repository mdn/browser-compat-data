/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserName, CompatStatement } from '../../types/types.js';
import bcd from '../../index.js';
const { browsers } = bcd;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load exception list for standard_track features without spec_url
const exceptionListPath = join(
  __dirname,
  'standard_track_without_spec_url.txt',
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
 * @param data The data to check
 * @returns The expected experimental status
 */
export const checkExperimental = (data: CompatStatement): boolean => {
  if (data.status?.experimental) {
    // Check if experimental should be false (code copied from migration 007)

    const browserSupport = new Set<BrowserName>();

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
          browserSupport.add(browser as BrowserName);
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
 * @param data The data to test
 * @param logger The logger to output errors to
 * @param category The feature category
 * @param featurePath The full path to the feature (e.g., "api.Animation.remove_filling_animation")
 */
const checkStatus = (
  data: CompatStatement,
  logger: Logger,
  category: string,
  featurePath: string,
): void => {
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
      chalk`{yellow Feature is in the exception list but no longer needs to be (spec_url was added or standard_track is false). Remove from {bold standard_track_without_spec_url.txt}}`,
    );
  }

  if (!checkExperimental(data)) {
    logger.error(
      chalk`{red {bold Experimental} should be set to {bold false} as the feature is {bold supported} in {bold multiple browser} engines.}`,
      { fixable: true },
    );
  }
};

export default {
  name: 'Status',
  description: 'Test the status of support statements',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   * @param root.path.category The category the data belongs to
   * @param root.path.full The full path to the feature
   */
  check: (logger: Logger, { data, path: { category, full } }: LinterData) => {
    checkStatus(data, logger, category, full);
  },
} as Linter;
