const chalk = require('chalk');
const { Logger } = require('./utils.js');

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
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testStatus(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Flag consistency');

  checkStatus(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testStatus;
