/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserName } from '../../types/types.js';
import { InternalSupportBlock } from '../../types/index';
import bcd from '../../index.js';
const { browsers } = bcd;
import { isMirrorEquivalent } from '../fixer/mirror.js';

/**
 * Check the data to ensure all statements that should use `mirror` do
 * @param supportData The data to test
 * @param category The category the data
 * @param logger The logger to output errors to
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
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   * @param root.path The path of the data
   * @param root.path.category The category the data belongs to
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    checkMirroring(data.support, category, logger);
  },
} as Linter;
