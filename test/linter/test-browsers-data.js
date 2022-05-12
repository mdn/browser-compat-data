/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

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
  // We only need to grab the first browser in the data
  // because each browser file only contains one browser
  const browser = Object.keys(data.browsers)[0];
  const releases = data.browsers[browser].releases;

  for (const status of ['current', 'beta', 'nightly']) {
    const releasesForStatus = Object.entries(releases)
      .filter(([_, data]) => data.status == status)
      .map(([version]) => version);

    if (releasesForStatus.length > 1) {
      logger.error(
        chalk`{red → {bold ${browser}} has multiple {bold ${status}} releases (${releasesForStatus.join(
          ', ',
        )}), which is {bold not} allowed.}`,
      );
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
