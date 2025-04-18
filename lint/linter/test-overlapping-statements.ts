/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { compareVersions } from 'compare-versions';

import { Linter, Logger, LinterData } from '../utils.js';
import {
  BrowserName,
  SimpleSupportStatement,
  SupportStatement,
} from '../../types/types.js';
import compareStatements from '../../scripts/lib/compare-statements.js';

/**
 * Formats a support statement as a simplified JSON-like version range.
 * @param stmt The statement to format
 * @returns The formatted range
 */
const formatRange = (stmt: SimpleSupportStatement): string => {
  const result: string[] = [];
  if (stmt.version_added) {
    result.push(`added: ${stmt.version_added}`);
  }
  if (stmt.version_removed) {
    result.push(`removed: ${stmt.version_removed}`);
  }

  return `{ ${result.join(', ')} }`;
};

/**
 * Process data and check to make sure there aren't support statements whose version ranges overlap.
 * @param data The data to test
 * @param browser The name of the browser
 * @param logger The logger to output errors to
 */
const processData = (
  data: SupportStatement,
  browser: BrowserName,
  logger: Logger,
): void => {
  if (!Array.isArray(data)) {
    // If there's only one statement, skip since this is a linter for multiple statements
    return;
  }

  // For now, let's ignore prefixes, alternative names, flags, and preview versions.
  const statements = data
    .filter(
      (d) =>
        !(
          d.prefix ||
          d.alternative_name ||
          d.flags ||
          d.version_added === 'preview'
        ),
    )
    .sort(compareStatements)
    .reverse();

  for (let i = 1; i < statements.length; i++) {
    const previous = statements.at(i - 1) as SimpleSupportStatement;
    const current = statements.at(i) as SimpleSupportStatement;

    if (
      typeof previous.version_removed !== 'string' ||
      typeof current.version_added !== 'string'
    ) {
      // Ignore for now.
      continue;
    }

    if (compareVersions(previous.version_removed, current.version_added) <= 0) {
      // All good.
      continue;
    }

    logger.error(
      [
        chalk`{bold ${browser}} has overlapping statements:`,
        `[${formatRange(current)}, ${formatRange(previous)}].`,
        chalk`Please check which one is correct, and update the other statement accordingly.`,
      ].join(' '),
    );
  }
};

export default {
  name: 'Overlapping Statements',
  description: 'Ensure there are no statements with overlapping version ranges',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   */
  check: (logger: Logger, { data }: LinterData) => {
    for (const [browser, support] of Object.entries(data.support)) {
      processData(support as SupportStatement, browser as BrowserName, logger);
    }
  },
} as Linter;
