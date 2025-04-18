/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { compareVersions } from 'compare-versions';

import {
  Linter,
  Logger,
  LinterData,
  createStatementGroupKey,
} from '../utils.js';
import {
  BrowserName,
  SimpleSupportStatement,
  SupportStatement,
} from '../../types/types.js';
import compareStatements from '../../scripts/lib/compare-statements.js';

/**
 * Groups statements by group key.
 * @param data The support statements to group.
 * @returns the statement groups
 */
const groupByStatementKey = (data: SimpleSupportStatement[]) => {
  const groups = new Map<string, SimpleSupportStatement[]>();

  for (const support of data) {
    const key = createStatementGroupKey(support);
    const group = groups.get(key);
    if (group) {
      group.push(support);
    } else {
      groups.set(key, [support]);
    }
  }
  return groups;
};

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

  const groups = groupByStatementKey(data);

  for (const [key, data] of groups.entries()) {
    const statements = data.sort(compareStatements).reverse();

    for (let i = 1; i < statements.length; i++) {
      const previous = statements.at(i - 1) as SimpleSupportStatement;
      const current = statements.at(i) as SimpleSupportStatement;

      if (typeof previous.version_removed === 'string') {
        // If previous has no removed version, we always have an overlap.

        if (current.version_added === 'preview') {
          // Feature got re-introduced.
          continue;
        }

        if (
          typeof current.version_added === 'string' &&
          compareVersions(previous.version_removed, current.version_added) <= 0
        ) {
          // No overlap.
          continue;
        }
      }

      logger.error(
        chalk`{bold ${browser}} statements overlap for {bold ${key}}: ` +
          `[${formatRange(current)}, ${formatRange(previous)}]`,
      );
    }
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
