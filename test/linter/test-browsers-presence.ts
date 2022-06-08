/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger } from '../utils.js';
import { BrowserName, CompatStatement } from '../../types/types.js';

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../../types').Identifier} Identifier
 * @typedef {import('../utils').Logger} Logger
 */

/**
 * Check the data for any disallowed browsers or if it's missing required browsers
 *
 * @param {Identifier} data The data to test
 * @param {string} category The category the data belongs to.
 * @param {Logger} logger The logger to output errors to.
 * @param {string} [path] The path of the data.
 * @returns {void}
 */
function processData(data, category, logger, path = '') {
  if (data.support) {
    const support = data.support;
    const definedBrowsers = Object.keys(support);

    let displayBrowsers = (Object.keys(browsers) as BrowserName[]).filter(
      (b) =>
        [
          'desktop',
          'mobile',
          'xr',
          ...(['api', 'javascript'].includes(category) ? ['server'] : []),
        ].includes(browsers[b].type) &&
        (category !== 'webextensions' || browsers[b].accepts_webextensions),
    );
    let requiredBrowsers = (Object.keys(browsers) as BrowserName[]).filter(
      (b) =>
        browsers[b].type == 'desktop' &&
        (category !== 'webextensions' || browsers[b].accepts_webextensions),
    );

    const undefEntries = definedBrowsers.filter(
      (value) => !(value in browsers),
    );
    if (undefEntries.length > 0) {
      logger.error(
        chalk`{red → {bold ${path}} has the following browsers, which are not defined in BCD: {bold ${undefEntries.join(
          ', ',
        )}}}`,
      );
    }

    const invalidEntries = Object.keys(support).filter(
      (value) => !displayBrowsers.includes(value),
    );
    if (invalidEntries.length > 0) {
      logger.error(
        chalk`{bold ${path}} has the following browsers, which are invalid for {bold ${category}} compat data: {bold ${invalidEntries.join(
          ', ',
        )}}`,
      );
    }

    const missingEntries = requiredBrowsers.filter(
      (value) => !(value in support),
    );
    if (missingEntries.length > 0) {
      logger.error(
        chalk`{bold ${path}} is missing the following browsers, which are required for {bold ${category}} compat data: {bold ${missingEntries.join(
          ', ',
        )}}`,
      );
    }
  }
}

export default {
  name: 'Browser Presence',
  description:
    'Test the presence of browser data within compatibility statements',
  scope: 'feature',
  check(
    logger: Logger,
    {
      data,
      path: { category },
    }: { data: CompatStatement; path: { category: string } },
  ) {
    processData(data, category, logger);
  },
} as Linter;
