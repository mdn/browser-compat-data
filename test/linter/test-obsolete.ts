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

// Once a category has been stripped of unsupported features, add it to this list
const categoriesToCheck = [
  'api',
  // 'css',
  // 'html',
  // 'http',
  // 'javascript',
  // 'mathml',
  // 'svg',
  'webassembly',
  // 'webdriver',
  // 'webextensions'
];

/**
 * Check if feature has never been implemented
 * @param {InternalSupportBlock} support The support statement
 * @returns {boolean} If the feature was never implemented
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
  warningTime = new Date();
errorTime.setFullYear(errorTime.getFullYear() - 2.5);
warningTime.setFullYear(warningTime.getFullYear() - 2);

/**
 * Check if a feature has been implemented at some point but removed now
 * @param {InternalSupportBlock} support The support statement
 * @returns {LinterMessageLevel | false} Whether the feature should be removed from BCD
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
        browsers[browser].releases[d.version_removed].release_date;

      // No browser release date
      if (!releaseDateData) {
        return false;
      }

      const releaseDate = new Date(releaseDateData);
      // Feature was recently supported, no need to show warning
      if (warningTime < releaseDate) {
        return false;
      }
      // Feature was supported sufficiently recently to not show an error
      if (errorTime < releaseDate) {
        result = 'warning';
      }
    }
  }
  return result;
};

/**
 * Process and test the data
 * @param {Logger} logger The logger to output errors to
 * @param {CompatStatement} data The data to test
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
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger: Logger, { data, path: { category } }: LinterData) => {
    if (categoriesToCheck.includes(category)) {
      processData(logger, data);
    }
  },
  // XXX Exceptions disabled while the corresponding categories are ignored
  // exceptions: [
  // 'http.headers.Cache-Control.stale-if-error',
  // 'http.headers.Feature-Policy.layout-animations',
  // 'http.headers.Feature-Policy.legacy-image-formats',
  // 'http.headers.Feature-Policy.oversized-images',
  // 'http.headers.Feature-Policy.unoptimized-images',
  // 'http.headers.Feature-Policy.unsized-media',
  // 'svg.elements.view.zoomAndPan',
  // ],
} as Linter;
