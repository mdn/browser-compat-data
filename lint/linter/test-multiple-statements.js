/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { createStatementGroupKey } from '../utils.js';

/** @import {Linter, Logger, LinterData} from '../utils.js' */
/** @import {BrowserName, SupportStatement} from '../../types/types.js' */

/**
 * Process data and check to make sure there aren't multiple support statements without
 * `partial_implementation` or `prefix`/`alternative_name`
 * @param {SupportStatement} data The data to test
 * @param {BrowserName} browser The name of the browser
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (data, browser, logger) => {
  if (!Array.isArray(data)) {
    // If there's only one statement, skip since this is a linter for multiple statements
    return;
  }

  /** @type {string[]} */
  const statements = [];

  for (const d of data) {
    if (d.partial_implementation || d.version_removed || d.flags) {
      // If statement is of partial_implementation, has a version_removed, or is behind a flag, ignore
      continue;
    }

    const statementKey = createStatementGroupKey(d);

    if (statements.includes(statementKey)) {
      logger.error(
        chalk`{bold ${browser}} has multiple statements for {bold ${statementKey}} exist without partial implementation! Please {bold merge} these statements and {bold combine} their notes, or set {bold partial_implementation} to {bold true} on applicable statements.`,
      );
    }
    statements.push(statementKey);
  }
};

/** @type {Linter} */
export default {
  name: 'Multiple Statements',
  description:
    'Ensure there are not multiple statements without partial implementation or prefixes/alt. names',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    for (const [browser, support] of Object.entries(data.support)) {
      processData(
        /** @type {SupportStatement} */ (support),
        /** @type {BrowserName} */ (browser),
        logger,
      );
    }
  },
};
