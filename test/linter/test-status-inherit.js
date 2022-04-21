const chalk = require('chalk');
const { Logger } = require('./utils.js');

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
function checkStatusInheritance(data, logger, parentStatus = {}, path = []) {
  /** @type {StatusBlock} */
  const childStatus = data.__compat?.status;
  if (childStatus) {
    if (!childStatus.deprecated && parentStatus.deprecated) {
      logger.error(
        chalk`{red → Unexpected non-deprecated status while the parent is deprecated, in ${path.join(
          '.',
        )}}`,
      );
    }
    if (!childStatus.experimental && parentStatus.experimental) {
      logger.error(
        chalk`{red → Unexpected non-experimental status while the parent is experimental, in ${path.join(
          '.',
        )}}`,
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
 * @param {string} filename
 */
function testStatusInheritance(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Status inheritance');

  checkStatusInheritance(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testStatusInheritance;
