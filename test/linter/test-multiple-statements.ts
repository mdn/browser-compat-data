/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import {
  BrowserName,
  CompatStatement,
  SupportStatement,
} from '../../types/types.js';

import chalk from 'chalk-template';

/**
 * Process data and check to make sure there aren't multiple support statements without
 * `partial_implementation` or `prefix`/`alternative_name`
 *
 * @param {SupportStatement} data The data to test
 * @param {BrowserName} browser The name of the browser
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(
  data: SupportStatement,
  browser: BrowserName,
  logger: Logger,
): void {
  if (!Array.isArray(data)) {
    // If there's only one statement, skip since this is a linter for multiple statements
    return;
  }

  const statements: string[] = [];

  for (const d of data) {
    if (d.partial_implementation || d.version_removed || d.flags) {
      // If statement is of partial_implementation, has a version_removed, or is behind a flag, ignore
      continue;
    }

    const statementKey = d.prefix
      ? `prefix: ${d.prefix}`
      : d.alternative_name
      ? `alt. name: ${d.alternative_name}`
      : 'normal name';

    if (statements.includes(statementKey)) {
      logger.error(
        chalk`{bold ${browser}} has multiple statements for {bold ${statementKey}} exist without partial implementation! Please {bold merge} these statements and {bold combine} their notes, or set {bold partial_implementation} to {bold true} on applicable statements.`,
      );
    }
    statements.push(statementKey);
  }
}

export default {
  name: 'Multiple Statements',
  description:
    'Ensure there are not multiple statements without partial implementation or prefixes/alt. names',
  scope: 'feature',
  /**
   *
   * @param logger
   * @param root0
   * @param root0.data
   */
  check(logger: Logger, { data }: { data: CompatStatement }) {
    for (const [browser, support] of Object.entries(data.support)) {
      processData(support, browser as BrowserName, logger);
    }
  },
} as Linter;
