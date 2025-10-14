/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import {
  BrowserName,
  CompatStatement,
  SimpleSupportStatement,
} from '../../types/types.js';
import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * Parse version string to extract numeric version
 * @param version The version string (e.g., "76", "≤79", "preview", true, false, null)
 * @returns The numeric version string or null
 */
export const parseVersion = (
  version: string | boolean | null | undefined,
): string | null => {
  if (!version || typeof version !== 'string') {
    return null;
  }

  // Skip preview builds
  if (version === 'preview') {
    return null;
  }

  // Handle ≤ notation - use the specified version
  if (version.startsWith('≤')) {
    return version.substring(1);
  }

  return version;
};

/**
 * Get the earliest release date for a feature in a specific engine
 * @param data The compat statement
 * @param engine The engine name (Blink, Gecko, or WebKit)
 * @returns The earliest release date or null if not found
 */
export const getEarliestReleaseDate = (
  data: CompatStatement,
  engine: string,
): Date | null => {
  let earliest: Date | null = null;

  for (const [browserName, support] of Object.entries(data.support)) {
    // Consider only the first part of an array statement
    const statement: SimpleSupportStatement = Array.isArray(support)
      ? support[0]
      : support;

    // Ignore anything behind flag, prefix or alternative name
    if (statement.flags || statement.prefix || statement.alternative_name) {
      continue;
    }

    // Only consider added features (not removed-only)
    if (!statement.version_added || statement.version_removed) {
      continue;
    }

    const browser = browsers[browserName as BrowserName];
    if (!browser) {
      continue;
    }

    // Check if this browser uses the target engine
    const currentRelease = Object.values(browser.releases).find(
      (r) => r.status === 'current',
    );

    if (currentRelease?.engine !== engine) {
      continue;
    }

    // Parse the version and look up release date
    const version = parseVersion(statement.version_added);
    if (!version) {
      continue;
    }

    const release = browser.releases[version];
    if (!release?.release_date) {
      continue;
    }

    const date = new Date(release.release_date);
    if (!earliest || date < earliest) {
      earliest = date;
    }
  }

  return earliest;
};

/**
 * Information about experimental status validation
 */
export interface ExperimentalCheckResult {
  valid: boolean;
  reason?: 'multi-engine' | 'single-engine-recent';
  engine?: string;
  releaseDate?: string;
}

/**
 * Check if experimental should be true or false
 * @param data The data to check
 * @returns Validation result with details about any issues
 */
export const checkExperimental = (
  data: CompatStatement,
): ExperimentalCheckResult => {
  if (data.status?.experimental) {
    // Check if experimental should be false (code copied from migration 007)

    const browserSupport = new Set<BrowserName>();

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
      return { valid: false, reason: 'multi-engine' };
    }
  }

  // Check if experimental is false but should be true
  if (data.status?.experimental === false) {
    const browserSupport = new Set<BrowserName>();

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

    // Check which of Blink, Gecko and WebKit support it
    const engineSupport = new Set<string>();

    for (const browser of browserSupport) {
      const currentRelease = Object.values(browsers[browser].releases).find(
        (r) => r.status === 'current',
      );
      const engine = currentRelease?.engine;
      if (engine) {
        engineSupport.add(engine);
      }
    }

    // Count engines among the major three
    let engineCount = 0;
    for (const engine of ['Blink', 'Gecko', 'WebKit']) {
      if (engineSupport.has(engine)) {
        engineCount++;
      }
    }

    // If 2+ engines support it, experimental: false is valid
    if (engineCount > 1) {
      return { valid: true };
    }

    // If single engine, check if it's been stable for 2+ years
    if (engineCount === 1) {
      const engine = Array.from(engineSupport).find((e) =>
        ['Blink', 'Gecko', 'WebKit'].includes(e),
      );

      if (engine) {
        const earliestDate = getEarliestReleaseDate(data, engine);

        if (earliestDate) {
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

          if (earliestDate > twoYearsAgo) {
            // ERROR: Single engine support is less than 2 years old
            return {
              valid: false,
              reason: 'single-engine-recent',
              engine,
              releaseDate: earliestDate.toISOString().split('T')[0],
            };
          }
        }
      }
    }

    // If no engine support or single engine > 2 years old, it's valid
    return { valid: true };
  }

  return { valid: true };
};

/**
 * Check the status blocks of the compat date
 * @param data The data to test
 * @param logger The logger to output errors to
 * @param category The feature category
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

  const experimentalCheck = checkExperimental(data);
  if (!experimentalCheck.valid) {
    if (experimentalCheck.reason === 'multi-engine') {
      logger.error(
        chalk`{red {bold Experimental} should be set to {bold false} as the feature is {bold supported} in {bold multiple browser} engines.}`,
        { fixable: true },
      );
    } else if (experimentalCheck.reason === 'single-engine-recent') {
      logger.error(
        chalk`{red {bold Experimental} should be set to {bold true} as the feature is only supported in a single browser engine ({bold ${experimentalCheck.engine}}) for less than 2 years (since ${experimentalCheck.releaseDate}).}`,
        { fixable: true },
      );
    }
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
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    checkStatus(data, logger, category);
  },
} as Linter;
