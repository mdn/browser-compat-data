/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData, LinterPath } from '../utils.js';
import { CompatStatement } from '../../types/types.js';
import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * Check the data for any disallowed browsers or if it's missing required browsers
 * @param data The data to test
 * @param path The path of the data
 * @param logger The logger to output errors to.
 */
const processData = (
  data: CompatStatement,
  path: LinterPath,
  logger: Logger,
): void => {
  if (data.support) {
    const support = data.support;
    const { category } = path;
    const definedBrowsers = Object.keys(support);

    const displayBrowsers = (
      Object.keys(browsers) as (keyof typeof browsers)[]
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
        (category !== 'webextensions' || browsers[b].accepts_webextensions) &&
        (!path.full?.startsWith('webdriver.bidi.') ||
          browsers[b].accepts_webdriver_bidi),
    );
    const requiredBrowsers = (
      Object.keys(browsers) as (keyof typeof browsers)[]
    ).filter(
      (b) =>
        browsers[b].type == 'desktop' &&
        (category !== 'webextensions' || browsers[b].accepts_webextensions) &&
        (!path.full?.startsWith('webdriver.bidi.') ||
          browsers[b].accepts_webdriver_bidi),
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

    const invalidEntries = (
      Object.keys(support) as (keyof typeof support)[]
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

export default {
  name: 'Browser Presence',
  description:
    'Test the presence of browser data within compatibility statements',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   */
  check: (logger: Logger, { data, path }: LinterData) => {
    processData(data, path, logger);
  },
} as Linter;
