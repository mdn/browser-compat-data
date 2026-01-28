/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatStatement} from '../../types/types.js' */

/**
 * Check the data for any disallowed browsers or if it's missing required browsers
 * @param {CompatStatement} data The data to test
 * @param {string} category The category the data belongs to.
 * @param {Logger} logger The logger to output errors to.
 * @returns {void}
 */
const processData = (data, category, logger) => {
  if (data.support) {
    const support = data.support;
    const definedBrowsers = Object.keys(support);

    const displayBrowsers = /** @type {(keyof typeof browsers)[]} */ (
      Object.keys(browsers)
    ).filter(
      (b) =>
        [
          'desktop',
          'mobile',
          'xr',
          ...(['api', 'javascript', 'webassembly'].includes(category)
            ? ['server']
            : []),
        ].includes(browsers[b].type) &&
        (category !== 'webextensions' || browsers[b].accepts_webextensions),
    );
    const requiredBrowsers = /** @type {(keyof typeof browsers)[]} */ (
      Object.keys(browsers)
    ).filter(
      (b) =>
        !['ie'].includes(b) &&
        ['desktop', 'mobile'].includes(browsers[b].type) &&
        (category !== 'webextensions' || browsers[b].accepts_webextensions),
    );

    const undefEntries = definedBrowsers.filter(
      (value) => !(value in browsers),
    );
    if (undefEntries.length > 0) {
      logger.error(
        chalk`Has the following browsers, which are not defined in BCD: {bold ${undefEntries.join(
          ', ',
        )}}`,
      );
    }

    const invalidEntries = /** @type {(keyof typeof support)[]} */ (
      Object.keys(support)
    ).filter((value) => !displayBrowsers.includes(value));
    if (invalidEntries.length > 0) {
      logger.error(
        chalk`Has the following browsers, which are invalid for {bold ${category}} compat data: {bold ${invalidEntries.join(
          ', ',
        )}}`,
      );
    }

    const missingEntries = requiredBrowsers.filter(
      (value) => !(value in support),
    );
    if (missingEntries.length > 0) {
      logger.error(
        chalk`Missing the following browsers, which are required for {bold ${category}} compat data: {bold ${missingEntries.join(
          ', ',
        )}}`,
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
    processData(/** @type {CompatStatement} */ (data), category, logger);
  },
};
