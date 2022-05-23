/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { Logger } from '../utils.js';

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types.js').StatusBlock} StatusBlock
 */

function checkStatusContradiction(status, logger, path = []) {
  if (status && status.experimental && status.deprecated) {
    logger.error(
      chalk`Unexpected simultaneous experimental and deprecated status in ${path.join(
        '.',
      )}`,
      chalk`Run {bold npm run fix} to fix this issue automatically`,
    );
  }
}

/**
 * @param {StatusBlock} childStatus
 * @param {StatusBlock?} parentStatus
 * @param {Logger} logger
 * @param {string[]} path
 */
 function checkStatusInheritance(childStatus, parentStatus, logger, path = []) {
  if (childStatus && parentStatus) {
    if (!childStatus.deprecated && parentStatus.deprecated) {
      logger.error(
        `Unexpected non-deprecated status while the parent is deprecated, in ${path.join(
          '.',
        )}`,
        chalk`Run {bold npm run fix} to fix this issue automatically`,
      );
    }
    if (
      !childStatus.experimental &&
      !childStatus.deprecated &&
      parentStatus.experimental
    ) {
      logger.error(
        `Unexpected non-experimental and non-deprecated status while the parent is experimental, in ${path.join(
          '.',
        )}`,
        chalk`Run {bold npm run fix} to fix this issue automatically`,
      );
    }
    if (childStatus?.standard_track && !parentStatus.standard_track) {
      logger.error(
        `Unexpected standard track status while the parent is nonstandard, in ${path.join(
          '.',
        )}`,
        chalk`Run {bold npm run fix} to fix this issue automatically`,
      );
    }
  }
}

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @param {StatusBlock?} parentStatus,
 * @param {string[]} path
 */
function checkStatus(data, logger, parentStatus, path = []) {
  const childStatus = data.__compat?.status;

  checkStatusContradiction(childStatus, logger, path);
  checkStatusInheritance(childStatus, parentStatus, logger, path);

  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    checkStatus(data[member], logger, childStatus, [...path, member]);
  }
}

/**
 * @param {Identifier} data The contents of the file to test
 * @returns {boolean} If the file contains errors
 */
export default function testStatus(data) {
  const logger = new Logger('Status');

  checkStatus(data, logger);

  logger.emit();
  return logger.hasErrors();
}
