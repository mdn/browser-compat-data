/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * @param {string} browser
 * @param {BrowserStatement} data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
function processData(browser, data, logger) {
  for (const status of ['current', 'nightly']) {
    const releasesForStatus = Object.entries(data.releases)
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
  if (data.upstream) {
    if (data.upstream === browser) {
      logger.error(
        chalk`{red The upstream for {bold ${browser}} is set to itself.}`,
      );
    }

    if (!Object.keys(browsers).includes(data.upstream)) {
      logger.error(
        chalk`{red The upstream for {bold ${browser}} is an unknown browser (${
          data.upstream
        }) Valid options are: ${Object.keys(browsers).join(', ')}.}`,
      );
    }
  }
}

export default {
  name: 'Browser Data',
  description: 'Test the browser data',
  scope: 'browser',
  check(logger, { data, path: { browser } }) {
    processData(browser, data, logger);
  },
};
