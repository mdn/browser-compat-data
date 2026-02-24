/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import bcd from '../../index.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {InternalCompatStatement} from '../../types/index.js' */

/**
 * Check the data for any disallowed browsers or if it's missing required browsers
 * @param {InternalCompatStatement} data The data to test
 * @param {string} category The category the data belongs to.
 * @param {Logger} logger The logger to output errors to.
 * @returns {void}
 */
const processData = (data, category, logger) => {
  if (data.support) {
    const support = data.support;
    const definedBrowsers = Object.keys(support);

    const displayBrowsers = Object.entries(bcd.browsers).flatMap(
      ([name, browser]) =>
        [
          'desktop',
          'mobile',
          'xr',
          ...(['api', 'javascript', 'webassembly'].includes(category)
            ? ['server']
            : []),
        ].includes(browser.type) &&
        (category !== 'webextensions' || browser.accepts_webextensions)
          ? [name]
          : [],
    );
    const requiredBrowsers = Object.keys(bcd.browsers).filter(
      (b) =>
        !['ie'].includes(b) &&
        ['desktop', 'mobile'].includes(bcd.browsers[b].type) &&
        (category !== 'webextensions' || bcd.browsers[b].accepts_webextensions),
    );

    const undefEntries = definedBrowsers.filter(
      (value) => !(value in bcd.browsers),
    );
    if (undefEntries.length > 0) {
      logger.error(
        `Has the following browsers, which are not defined in BCD: ${styleText('bold', undefEntries.join(', '))}`,
      );
    }

    const invalidEntries = Object.keys(support).filter(
      (value) => !displayBrowsers.includes(value),
    );
    if (invalidEntries.length > 0) {
      logger.error(
        `Has the following browsers, which are invalid for ${styleText('bold', category)} compat data: ${styleText('bold', invalidEntries.join(', '))}`,
      );
    }

    const missingEntries = requiredBrowsers.filter(
      (value) => !(value in support),
    );
    if (missingEntries.length > 0) {
      logger.error(
        `Missing the following browsers, which are required for ${styleText('bold', category)} compat data: ${styleText('bold', missingEntries.join(', '))}`,
      );
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Browser Presence',
  description:
    'Test the presence of browser data within compatibility statements',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category } }) => {
    processData(
      /** @type {InternalCompatStatement} */ (data),
      category,
      logger,
    );
  },
};
