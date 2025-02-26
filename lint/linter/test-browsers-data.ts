/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserStatement, BrowserName } from '../../types/types.js';
import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * Process and test the data
 * @param browser The name of the browser
 * @param data The browser statement
 * @param logger The logger to output errors to
 */
const processData = (
  browser: BrowserName,
  data: BrowserStatement,
  logger: Logger,
): void => {
  for (const status of ['current', 'nightly']) {
    const releasesForStatus = data.releases
      .filter((data) => data.status == status)
      .map(({ version }) => version);

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

  // Ensure every retired/current release has a release date.
  for (const status of ['retired', 'current']) {
    if (browser === 'oculus') {
      // Ignore Oculus Browser, because release dates for versions 5.0 to 15.1 are not publicly documented.
      continue;
    }
    const releasesWithoutDate = data.releases
      .filter(
        (data) =>
          data.status == status && typeof data.release_date === 'undefined',
      )
      .map(({ version }) => version);

    if (releasesWithoutDate.length > 0) {
      logger.error(
        chalk`{red {bold ${browser}} has {bold ${status}} releases without release date (${releasesWithoutDate.join(
          ', ',
        )}), which is {bold not} allowed.}`,
      );
    }
  }
};

export default {
  name: 'Browser Data',
  description: 'Test the browser data',
  scope: 'browser',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The browser data
   * @param root.path The path to the browser data
   * @param root.path.browser The name of the browser
   */
  check: (logger: Logger, { data, path: { browser } }: LinterData) => {
    processData(browser as BrowserName, data, logger);
  },
} as Linter;
