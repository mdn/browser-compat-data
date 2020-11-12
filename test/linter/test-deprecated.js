const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @param {boolean} isParentDeprecated,
 * @param {string[]} path
 */
function checkStatus(data, logger, isParentDeprecated, path = []) {
  const status = data.__compat && data.__compat.status;
  const deprecated = status && status.deprecated;
  if (!deprecated && isParentDeprecated) {
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
    checkStatus(data[member], logger, deprecated, [...path, member]);
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testDeprecated(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Deprecated');

  checkStatus(data, logger, false);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testDeprecated;
