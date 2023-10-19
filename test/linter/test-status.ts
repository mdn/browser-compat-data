/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserName, CompatStatement } from '../../types/types.js';
import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * Check if experimental should be true or false
 * @param {CompatStatement} data The data to check
 * @returns {boolean} The expected experimental status
 */
export const checkExperimental = (data: CompatStatement): boolean => {
  if (data.status?.experimental) {
    // Check if experimental should be false (code copied from migration 007)

    const browserSupport: Set<BrowserName> = new Set();

    for (const [browser, support] of Object.entries(data.support)) {
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
 * @param {CompatStatement} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @param {string} category The feature category
 */
const checkStatus = (
  data: CompatStatement,
  logger: Logger,
  category: string,
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
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    checkStatus(data, logger, category);
  },
} as Linter;
