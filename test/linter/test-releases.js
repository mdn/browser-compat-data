const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

const uniqueStatuses = ['current', 'beta', 'nightly'];

/**
 * @param {Identifier} data
 * @param {Logger} logger
 */
function checkReleases(data, logger) {
  const releases = Object.values(Object.values(data.browsers)[0].releases);
  const existences = [];

  for (const release of releases) {
    const { status } = release;
    if (uniqueStatuses.includes(status)) {
      if (existences.includes(status)) {
        logger.error(chalk`{red Unexpected multiple statuses "${status}"}`);
      } else {
        existences.push(status);
      }
    }
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testReleases(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Releases');

  checkReleases(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testReleases;
