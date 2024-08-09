/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

/**
 * Check the status blocks of the compat date
 * @param data The data to test
 * @param logger The logger to output errors to
 * @param category The feature category
 */
const checkStatus = (
  data: CompatStatement,
  logger: Logger,
  category: string,
): void => {
  const status = data.status;

  if (!status) {
    return;
  } else if (category === 'webextensions') {
    logger.error(
      chalk`{red Has a {bold status object}, which is {bold not allowed} for web extensions.}`,
    );
  }

  if ('experimental' in status) {
    logger.error(
      chalk`{red The {bold experimental} property is automatically set}`,
      { fixable: true },
    );
  }

  if ('standard_track' in status) {
    logger.error(
      chalk`{red The {bold standard_track} property is automatically set}`,
      { fixable: true },
    );
  }
};

export default {
  name: 'Status',
  description: 'Test the status of support statements',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   * @param root.path.category The category the data belongs to
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    checkStatus(data, logger, category);
  },
} as Linter;
