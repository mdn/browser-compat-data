/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Logger } from '../utils.js';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * @param {Identifier} data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(data, logger) {
  // We only need to grab the first browser in the data
  // because each browser file only contains one browser
  const browser = Object.keys(data.browsers)[0];
  const browserData = data.browsers[browser];

  for (const status of ['current', 'beta', 'nightly']) {
    const releasesForStatus = Object.entries(browserData.releases)
      .filter(([, data]) => data.status == status)
      .map(([version]) => version);

    if (releasesForStatus.length > 1) {
      logger.error(
        chalk`{red {bold ${browser}} has multiple {bold ${status}} releases (${releasesForStatus.join(
          ', ',
        )}), which is {bold not} allowed.}`,
      );
    }
  }

  // Ensure the `upstream` property, if it exists, is valid
  if (browserData.upstream) {
    if (browserData.upstream === browser) {
      logger.error(
        chalk`{red The upstream for {bold ${browser}} is set to itself.}`,
      );
    }

    if (!Object.keys(browsers).includes(browserData.upstream)) {
      logger.error(
        chalk`{red The upstream for {bold ${browser}} is an unknown browser (${browserData.upstream}).}`,
      );
    }
  }
}

/**
 * @param {Identifier} data The contents of the file to test
 * @returns {boolean} If the file contains errors
 */
export default function testBrowsersData(data) {
  const logger = new Logger('Browser Data');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
}
