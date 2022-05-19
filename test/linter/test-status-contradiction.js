/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { Logger } from '../utils.js';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 */
function checkStatus(data, logger, path = []) {
  const status = data.__compat?.status;
  if (status && status.experimental && status.deprecated) {
    logger.error(
      chalk`{red Unexpected simultaneous experimental and deprecated status in ${path.join(
        '.',
      )}}`,
    );
  }
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    checkStatus(data[member], logger, [...path, member]);
  }
}

/**
 * @param {Identifier} data The contents of the file to test
 * @returns {boolean} If the file contains errors
 */
function testStatusContradiction(data) {
  const logger = new Logger('Flag consistency');

  checkStatus(data, logger);

  logger.emit();
  return logger.hasErrors();
}

export default testStatusContradiction;
