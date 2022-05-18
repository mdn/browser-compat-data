/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import chalk from 'chalk';

import { Logger } from '../utils.js';

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
  const releases = data.browsers[browser].releases;

  for (const status of ['current', 'beta', 'nightly']) {
    const releasesForStatus = Object.entries(releases)
      .filter(([, data]) => data.status == status)
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
export default function testBrowsersData(filename) {
  /** @type {Identifier} */
  const data = JSON.parse(
    fs.readFileSync(new URL(filename, import.meta.url), 'utf-8'),
  );

  const logger = new Logger('Browser Data');

  processData(data, logger);

  logger.emit();
  return logger.hasErrors();
}
