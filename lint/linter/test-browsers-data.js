/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import bcd from '../../index.js';
const { browsers } = bcd;

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {BrowserStatement, BrowserName} from '../../types/index.js' */

/**
 * Process and test the data
 * @param {BrowserName} browser The name of the browser
 * @param {BrowserStatement} data The browser statement
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const processData = (browser, data, logger) => {
  for (const status of ['current', 'nightly']) {
    const releasesForStatus = Object.entries(data.releases)
      .filter(([, data]) => data.status == status)
      .map(([version]) => version);

    if (releasesForStatus.length > 1) {
      logger.error(
        styleText(
          'red',
          `${styleText('bold', browser)} has multiple ${styleText('bold', status)} releases (${releasesForStatus.join(', ')}), which is ${styleText('bold', 'not')} allowed.`,
        ),
      );
    }
  }

  // Ensure the `upstream` property, if it exists, is valid
  if (data.upstream) {
    if (data.upstream === browser) {
      logger.error(
        styleText(
          'red',
          `The upstream for ${styleText('bold', browser)} is set to itself.`,
        ),
      );
    }

    if (!Object.keys(browsers).includes(data.upstream)) {
      logger.error(
        styleText(
          'red',
          `The upstream for ${styleText('bold', browser)} is an unknown browser (${data.upstream}) Valid options are: ${Object.keys(browsers).join(', ')}.`,
        ),
      );
    }
  }

  // Ensure every retired/current release has a release date.
  for (const status of ['retired', 'current']) {
    if (browser === 'oculus') {
      // Ignore Oculus Browser, because release dates for versions 5.0 to 15.1 are not publicly documented.
      continue;
    }
    const releasesWithoutDate = Object.entries(data.releases)
      .filter(
        ([, data]) =>
          data.status == status && typeof data.release_date === 'undefined',
      )
      .map(([version]) => version);

    if (releasesWithoutDate.length > 0) {
      logger.error(
        styleText(
          'red',
          `${styleText('bold', browser)} has ${styleText('bold', status)} releases without release date (${releasesWithoutDate.join(', ')}), which is ${styleText('bold', 'not')} allowed.`,
        ),
      );
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Browser Data',
  description: 'Test the browser data',
  scope: 'browser',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { browser } }) => {
    processData(
      /** @type {BrowserName} */ (browser),
      /** @type {BrowserStatement} */ (data),
      logger,
    );
  },
};
