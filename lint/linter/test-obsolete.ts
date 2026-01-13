/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData, LinterMessageLevel } from '../utils.js';
import { BrowserName, CompatStatement } from '../../types/types.js';
import {
  InternalSupportBlock,
  InternalSupportStatement,
} from '../../types/index.js';
import bcd from '../../index.js';
const { browsers } = bcd;

// Once a category has been stripped of unsupported features, remove it from this list
const ignoredCategories = ['css'];

/**
 * Check if feature has never been implemented
 * @param support The support statement
 * @returns If the feature was never implemented
 */
export const neverImplemented = (support: InternalSupportBlock): boolean => {
  for (const s in support) {
    let data = support[s];
    if (!Array.isArray(data)) {
      data = [data];
    }
    for (const d of data) {
      if (d.version_added) {
        return false;
      }
    }
  }
  return true;
};

const errorTime = new Date(),
  infoTime = new Date();
errorTime.setFullYear(errorTime.getFullYear() - 2.5);
infoTime.setFullYear(infoTime.getFullYear() - 2);

/**
 * Check if a feature has been implemented at some point but removed now
 * @param support The support statement
 * @returns Whether the feature should be removed from BCD
 */
export const implementedAndRemoved = (
  support: InternalSupportBlock,
): LinterMessageLevel | false => {
  let result: LinterMessageLevel = 'error';
  for (const [browser, data] of Object.entries(support) as [
    BrowserName,
    InternalSupportStatement,
  ][]) {
    if (browser === 'ie') {
      // Don't consider IE support in obsolete checks
      continue;
    }

    // Feature is set to mirror; issues will come up in upstream browsers, ignore
    if (data === 'mirror') {
      continue;
    }

    for (const d of Array.isArray(data) ? data : [data]) {
      // Feature not supported and not being worked on; test other browsers
      if (d.version_added === false && !d.impl_url) {
        continue;
      }

      // Feature is still supported or it is not known when feature was dropped
      if (!d.version_removed || typeof d.version_removed === 'boolean') {
        return false;
      }

      const releaseDateData =
        browsers[browser].releases[d.version_removed.replace('≤', '')]
          .release_date;

      // No browser release date
      if (!releaseDateData) {
        return false;
      }

      const releaseDate = new Date(releaseDateData);
      // Feature was recently supported, no need to show warning
      if (infoTime < releaseDate) {
        return false;
      }
      // Feature was supported sufficiently recently to not show an error
      if (errorTime < releaseDate) {
        result = 'info';
      }
    }
  }

  return result;
};

/**
 * Process and test the data
 * @param logger The logger to output errors to
 * @param data The data to test
 */
export const processData = (logger: Logger, data: CompatStatement): void => {
  if (data && data.support) {
    const rule1Fail = neverImplemented(data.support);
    if (rule1Fail) {
      logger.error(chalk`feature was never implemented.`);

      // No need to perform the next check if the first one fails
      return;
    }

    // Note: This check is time-based
    const rule2Fail = implementedAndRemoved(data.support);
    if (rule2Fail) {
      logger[rule2Fail](
        chalk`feature was implemented and has since been removed from all browsers dating back two or more years ago.`,
      );
    }
  }
};

export default {
  name: 'Obsolete',
  description: 'Test for obsolete data in each support statement',
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
    if (!ignoredCategories.includes(category)) {
      processData(logger, data);
    }
  },
  exceptions: ['html.elements.track.kind.descriptions'],
} as Linter;
