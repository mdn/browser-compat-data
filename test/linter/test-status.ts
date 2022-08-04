/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserName, CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 *
 * @param {CompatStatement} data
 * @returns {boolean}
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
 * @param {CompatStatement} data
 * @param {Logger} logger
 * @param {string} path
 */
const checkStatus = (
  data: CompatStatement,
  logger: Logger,
  path: string[] = [],
): void => {
  const status = data.status;
  if (!status) {
    return;
  }

  if (status.experimental && status.deprecated) {
    logger.error(
      chalk`{red Unexpected simultaneous experimental and deprecated status in ${path.join(
        '.',
      )}}`,
      { fixable: true },
    );
  }

  if (data.spec_url && status.standard_track === false) {
    logger.error(
      chalk`{red {bold ${path.join(
        '.',
      )}} is marked as {bold non-standard}, but has a {bold spec_url}}`,
    );
  }

  if (!checkExperimental(data)) {
    logger.error(
      chalk`{red Experimental should be set to {bold false} for {bold ${path.join(
        '.',
      )}} as the feature is supported in multiple browser engines.}`,
    );
  }
};

export default {
  name: 'Status',
  description: 'Test the status of support statements',
  scope: 'feature',
  /**
   *
   * @param {Logger} logger
   * @param {LinterData} root0
   */
  check: (logger: Logger, { data }: LinterData) => {
    checkStatus(data, logger);
  },
} as Linter;
