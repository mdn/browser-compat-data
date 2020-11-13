const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../../types.js').StatusBlock} StatusBlock
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @param {StatusBlock} parentStatus,
 * @param {string[]} path
 */
function checkStatus(data, logger, parentStatus, path = []) {
  /** @type {StatusBlock} */
  const status = (data.__compat && data.__compat.status) || {};
  if (!status.deprecated && parentStatus.deprecated) {
    logger.error(
      chalk`{red → Unexpected non-deprecated status while the parent is deprecated, in ${path.join(
        '.',
      )}}`,
    );
  }
  for (const member in data) {
    if (member === '__compat') {
      continue;
    }
    checkStatus(data[member], logger, status, [...path, member]);
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testStatus(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Flag consistency');

  checkStatus(data, logger, false);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testStatus;
