/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { Logger } from '../utils.js';

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types.js').StatusBlock} StatusBlock
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @param {StatusBlock?} parentStatus,
 * @param {string[]} path
 */
function checkStatusInheritance(data, logger, parentStatus, path = []) {
  /** @type {StatusBlock} */
  const childStatus = data.__compat?.status;
  if (childStatus && parentStatus) {
    if (!childStatus.deprecated && parentStatus.deprecated) {
      logger.error(
        `Unexpected non-deprecated status while the parent is deprecated, in ${path.join(
          '.',
        )}`,
        chalk`Run {bold npm run fix} to fix this issue automatically`,
      );
    }
    if (!childStatus.experimental && parentStatus.experimental) {
      logger.error(
        `Unexpected non-experimental status while the parent is experimental, in ${path.join(
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
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    checkStatusInheritance(data[member], logger, childStatus, [
      ...path,
      member,
    ]);
  }
}

/**
 * @param {Identifier} data The contents of the file to test
 */
export default function testStatusInheritance(data) {
  const logger = new Logger('Status inheritance');

  checkStatusInheritance(data, logger);

  logger.emit();
  return logger.hasErrors();
}
