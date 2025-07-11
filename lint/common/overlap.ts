/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { compareVersions } from 'compare-versions';

import { Logger, createStatementGroupKey } from '../utils.js';
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
 * @param support The statement to format
 * @returns The formatted range
 */
const formatRange = (support: SimpleSupportStatement): string => {
  const result: string[] = [];
  if (support.version_added) {
    result.push(`added: ${support.version_added}`);
  }
  if (support.version_removed) {
    result.push(`removed: ${support.version_removed}`);
  }

  return `{ ${result.join(', ')} }`;
};

/**
 * Process data and check to make sure there aren't support statements whose version ranges overlap.
 * @param data The data to test
 * @param browser The name of the browser
 * @param options The check options
 * @param options.logger The logger to output errors to
 * @param options.fix Whether the statements should be fixed (if possible)
 * @returns the data (with fixes, if specified)
 */
export const checkOverlap = (
  data: SupportStatement,
  browser: BrowserName,
  { logger, fix = false }: { logger?: Logger; fix?: boolean },
): SupportStatement => {
  if (!Array.isArray(data)) {
    // If there's only one statement, skip since this is a linter for multiple statements
    return data;
  }

  const filteredData = data.filter((support) => !support.flags);

  const groups = groupByStatementKey(filteredData);

  for (const [groupKey, groupData] of groups.entries()) {
    const statements = groupData.slice().sort(compareStatements).reverse();

    for (let i = 0; i < statements.length - 1; i++) {
      const current = statements.at(i) as SimpleSupportStatement;
      const next = statements.at(i + 1) as SimpleSupportStatement;

      if (!statementsOverlap(current, next)) {
        continue;
      }

      let fixed = false;
      if (fix) {
        if (
          typeof current.version_removed === 'undefined' &&
          next.version_added !== 'preview'
        ) {
          current.version_removed = next.version_added;
          fixed = true;
        }
      }

      if (!fixed && logger) {
        logger.error(
          chalk`{bold ${browser}} statements overlap for {bold ${groupKey}}: ` +
            `[${formatRange(next)}, ${formatRange(current)}]`,
        );
      }
    }
  }

  return data;
};

/**
 * Checks if the support statements overlap in terms of their version ranges.
 * @param current the current statement.
 * @param next the chronologically following statement.
 * @returns Whether the support statements overlap.
 */
const statementsOverlap = (
  current: SimpleSupportStatement,
  next: SimpleSupportStatement,
): boolean => {
  if (typeof current.version_removed === 'string') {
    // If previous has no removed version, we always have an overlap.

    if (next.version_added === 'preview') {
      // Feature got re-introduced.
      return false;
    }

    if (
      typeof next.version_added === 'string' &&
      compareVersions(current.version_removed, next.version_added) <= 0
    ) {
      // No overlap.
      return false;
    }
  } else if (
    next.version_added === 'preview' &&
    current.partial_implementation === true
  ) {
    // Stable has partial support.
    // Preview has full support.
    return false;
  }

  return true;
};
