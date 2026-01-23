/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;
import { isMirrorEquivalent, isMirrorRequired } from '../fixer/mirror.js';

/** @import {Linter, Logger, LinterData} from '../utils.js' */
/** @import {BrowserName, CompatStatement} from '../../types/types.js' */
/** @import {InternalSupportBlock} from '../../types/index.js' */

/**
 * Check the data to ensure all statements that should use `mirror` do
 * @param {InternalSupportBlock} supportData The data to test
 * @param {string} category The category the data
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkMirroring = (supportData, category, logger) => {
  const browsersToCheck = /** @type {BrowserName[]} */ (
    Object.keys(browsers)
      .filter((b) =>
        category === 'webextensions' ? browsers[b].accepts_webextensions : !!b,
      )
      .filter((b) => browsers[b].upstream)
  );

  for (const browser of browsersToCheck) {
    if (
      isMirrorRequired(supportData, browser) &&
      isMirrorEquivalent(supportData, browser)
    ) {
      logger.error(
        chalk`Data for {bold ${browser}} can be automatically mirrored, use {bold "${browser}": "mirror"} instead`,
        { fixable: true },
      );
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Mirroring',
  description: 'Test statements for pre-mirroring',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category } }) => {
    checkMirroring(
      /** @type {CompatStatement} */ (data).support,
      category,
      logger,
    );
  },
};
