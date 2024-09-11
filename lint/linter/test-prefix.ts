/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

/**
 * Process the data for prefix errors
 * @param data The data to test
 * @param category The category the data belongs to
 * @param feature The full feature path
 * @param logger The logger to output errors to
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

  // "as string" cast performed because we know that -1 will always be a valid index
  const featureName = feature.split('.').at(-1) as string;
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
          const regex = new RegExp(
            `^:?:?${p}(${strippedFeatureName[0].toLowerCase()}|${strippedFeatureName[0].toUpperCase()})${strippedFeatureName.slice(
              1,
            )}$`,
            'g',
          );
          return statement.alternative_name?.match(regex);
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
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   * @param root.path.category The category the data belongs to
   * @param root.path.full The full filepath of the data
   */
  check: (logger: Logger, { data, path: { category, full } }: LinterData) => {
    processData(data, category, full, logger);
  },
} as Linter;
