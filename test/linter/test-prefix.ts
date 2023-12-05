/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement, Identifier } from '../../types/types.js';

/**
 * Process the data for prefix errors
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to
 * @param {string} feature The full feature path
 * @param {Logger} logger The logger to output errors to
 */
const processData = (
  data: CompatStatement,
  category: string,
  feature: string,
  logger: Logger,
): void => {
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

  const featureParts = feature.split('.');
  const featureName = featureParts[featureParts.length - 1];
  const strippedFeatureName = featureName.replace(/_(event|static)/, '');

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
      if (statement.alternative_name) {
        const altNameMatchesPrefix = prefixes.find((p) => {
          const prefixedName = `${p}${strippedFeatureName}`;
          return [
            prefixedName,
            ':' + prefixedName,
            '::' + prefixedName,
          ].includes(statement.alternative_name);
        });
        if (altNameMatchesPrefix) {
          logger.error(
            chalk`Use {bold "prefix": "${altNameMatchesPrefix}"} instead of {bold "alternative_name": "${statement.alternative_name}"}`,
          );
        }
      }
    }
  }
};

export default {
  name: 'Prefix',
  description: 'Ensure that prefixes in support statements are valid',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { category, full } }: LinterData) => {
    processData(data, category, full, logger);
  },
} as Linter;
