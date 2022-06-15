/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';

/**
 * Process the data for prefix errors
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(
  data: CompatStatement,
  category: string,
  logger: Logger,
): void {
  let prefixes: string[] = [];

  if (category === 'api') {
    prefixes = [
      'moz',
      'Moz',
      'MOZ_',
      'webkit',
      'WebKit',
      'webKit',
      'WEBKIT_',
      'ms',
      'MS',
      'o',
      'O',
    ];
  }
  if (category === 'css') {
    prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', '-khtml-'];
  }

  if (prefixes.length === 0) {
    // Prefixes aren't enforced for other categories
    return;
  }

  for (const support of Object.values(data.support)) {
    const supportStatements = Array.isArray(support) ? support : [support];

    for (const statement of supportStatements) {
      if (!statement) {
        continue;
      }
      if (statement.prefix && statement.alternative_name) {
        logger.error(
          chalk`Both prefix and alternative name are defined, which is not allowed.`,
        );
      }
      if (
        statement.prefix &&
        !prefixes.some((p) => statement.prefix?.startsWith(p))
      ) {
        logger.error(
          chalk`Prefix is set to {bold ${statement.prefix}}, which is invalid for ${category}`,
        );
      }
    }
  }
}

export default {
  name: 'Prefix',
  description: 'Ensure that prefixes in support statements are valid',
  scope: 'feature',
  check(
    logger: Logger,
    {
      data,
      path: { category },
    }: { data: CompatStatement; path: { category: string } },
  ) {
    processData(data, category, logger);
  },
} as Linter;
