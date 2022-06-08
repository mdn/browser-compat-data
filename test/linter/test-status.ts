/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import { CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 */
function checkStatus(data, logger, path = []) {
  const status = data.status;
  if (status && status.experimental && status.deprecated) {
    logger.error(
      chalk`{red Unexpected simultaneous experimental and deprecated status in ${path.join(
        '.',
      )}}`,
      { fixable: true },
    );
  }
}

export default {
  name: 'Status',
  description: 'Test the status of support statements',
  scope: 'feature',
  check(logger: Logger, { data }: { data: CompatStatement }) {
    checkStatus(data, logger);
  },
} as Linter;
