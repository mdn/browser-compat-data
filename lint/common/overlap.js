/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { compareVersions } from 'compare-versions';

import { createStatementGroupKey } from '../utils.js';
import compareStatements from '../../scripts/lib/compare-statements.js';

/** @import {Logger} from '../utils.js' */
/** @import {BrowserName, SimpleSupportStatement, InternalSupportStatement} from '../../types/index.js' */

/**
 * Groups statements by group key.
 * @param {SimpleSupportStatement[]} data The support statements to group.
 * @returns {Map<string, SimpleSupportStatement[]>} the statement groups
 */
const groupByStatementKey = (data) => {
  /** @type {Map<string, SimpleSupportStatement[]>} */
  const groups = new Map();

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
 * @param {SimpleSupportStatement} support The statement to format
 * @returns {string} The formatted range
 */
const formatRange = (support) => {
  /** @type {string[]} */
  const result = [];
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
 * @param {InternalSupportStatement} data The data to test
 * @param {BrowserName} browser The name of the browser
 * @param {object} options The check options
 * @param {Logger} [options.logger] The logger to output errors to
 * @param {boolean} [options.fix] Whether the statements should be fixed (if possible)
 * @returns {InternalSupportStatement} the data (with fixes, if specified)
 */
export const checkOverlap = (data, browser, { logger, fix = false }) => {
  if (!Array.isArray(data)) {
    // If there's only one statement, skip since this is a linter for multiple statements
    return data;
  }

  const filteredData = data.filter((support) => !support.flags);

  const groups = groupByStatementKey(filteredData);

  for (const [groupKey, groupData] of groups.entries()) {
    const statements = groupData.slice().sort(compareStatements).reverse();

    for (let i = 0; i < statements.length - 1; i++) {
      const current = /** @type {SimpleSupportStatement} */ (statements.at(i));
      const next = /** @type {SimpleSupportStatement} */ (statements.at(i + 1));

      if (!statementsOverlap(current, next)) {
        continue;
      }

      let fixed = false;
      if (fix) {
        if (
          typeof current.version_removed === 'undefined' &&
          next.version_added !== false &&
          next.version_added !== 'preview'
        ) {
          current.version_removed = next.version_added;
          fixed = true;
        }
      }

      if (!fixed && logger) {
        logger.error(
          `${styleText('bold', browser)} statements overlap for ${styleText('bold', groupKey)}: ` +
            `[${formatRange(next)}, ${formatRange(current)}]`,
        );
      }
    }
  }

  return data;
};

/**
 * Checks if the support statements overlap in terms of their version ranges.
 * @param {SimpleSupportStatement} current the current statement.
 * @param {SimpleSupportStatement} next the chronologically following statement.
 * @returns {boolean} Whether the support statements overlap.
 */
const statementsOverlap = (current, next) => {
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
