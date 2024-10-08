/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

const allowedNamespaces = ['web-features'];

/**
 * Process the data for spec URL errors
 * @param data The data to test
 * @param logger The logger to output errors to
 */
const processData = (data: CompatStatement, logger: Logger): void => {
  if (!data.tags) {
    return;
  }

  for (const tag of data.tags) {
    if (
      !allowedNamespaces.some(
        (namespace) =>
          tag.startsWith(namespace + ':') &&
          tag.split(':')[1].match(/^[a-z0-9-]*$/),
      )
    ) {
      logger.error(
        chalk`Invalid tag found: {bold ${tag}}. Check if:
         - tag tag has a namespace
         - the tag uses one of the allowed namespaces: {bold ${allowedNamespaces}}
         - the tag name (after the namespace) uses only lowercase alphanumeric characters (a-z and 0-9) plus the - character (hyphen or minus sign)`,
      );
    }
  }
};

export default {
  name: 'Tags',
  description: 'Ensure tags meet requirements like allowed namespaces.',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   */
  check: (logger: Logger, { data }: LinterData) => {
    processData(data, logger);
  },
} as Linter;
