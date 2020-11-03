'use strict';
const path = require('path');
const chalk = require('chalk');
const { Logger } = require('./utils.js');

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger
 * @returns {boolean}
 */
function processData(data, logger) {
  const browser = Object.keys(data.browsers)[0];
  const releases = data.browsers[browser].releases;

  let releaseByStatus = {
    current: null,
    beta: null,
    nightly: null,
    esr: null,
  };

  for (let releaseVersion in releases) {
    const releaseData = releases[releaseVersion];

    if (['current', 'beta', 'nightly', 'esr'].includes(releaseData.status)) {
      if (
        releaseData.status === 'esr' &&
        ['nodejs', 'firefox'].includes(browser)
      ) {
        continue;
      }
      if (releaseByStatus[releaseData.status]) {
        logger.error(
          chalk`{bold ${browser}} has multiple {bold ${
            releaseData.status
          }} releases (${
            releaseByStatus[releaseData.status]
          } and ${releaseVersion}), which is not allowed.`,
        );
      }

      releaseByStatus[releaseData.status] = releaseVersion;
    }
  }
}

/**
 * @param {string} filename
 * @returns {boolean} If the file contains errors
 */
function testBrowsersData(filename) {
  /** @type {Identifier} */
  const data = require(filename);

  const logger = new Logger('Browser Data');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
}

module.exports = testBrowsersData;
