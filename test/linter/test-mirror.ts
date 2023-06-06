/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserName, SupportBlock } from '../../types/types.js';
import { InternalSupportBlock } from '../../types/index';
import bcd from '../../index.js';
const { browsers } = bcd;
import { isMirrorEquivalent } from '../../scripts/fix/mirror.js';

/**
 * Check the data to ensure all statements that should use `mirror` do
 * @param {SupportBlock} supportData The data to test
 * @param {string} category The category the data
 * @param {Logger} logger The logger to output errors to
 */
const checkMirroring = (
  supportData: InternalSupportBlock,
  category: string,
  logger: Logger,
): void => {
  const browsersToCheck = Object.keys(browsers)
    .filter((b) =>
      category === 'webextensions' ? browsers[b].accepts_webextensions : !!b,
    )
    .filter((b) => browsers[b].upstream) as BrowserName[];

  for (const browser of browsersToCheck) {
    if (isMirrorEquivalent(supportData, browser)) {
      logger.error(
        chalk`Data for {bold ${browser}} can be automatically mirrored, use {bold "${browser}": "mirror"} instead`,
        { fixable: true },
      );
    }
  }
};

export default {
  name: 'Mirroring',
  description: 'Test statements for pre-mirroring',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    checkMirroring(data.support, category, logger);
  },
} as Linter;
