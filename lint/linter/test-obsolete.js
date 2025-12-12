/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import bcd from '../../index.js';
const { browsers } = bcd;

/**
 * @typedef {import('../utils.js').Linter} Linter
 * @typedef {import('../utils.js').Logger} Logger
 * @typedef {import('../utils.js').LinterData} LinterData
 * @typedef {import('../utils.js').LinterMessageLevel} LinterMessageLevel
 * @typedef {import('../../types/types.js').BrowserName} BrowserName
 * @typedef {import('../../types/types.js').CompatStatement} CompatStatement
 * @typedef {import('../../types/index.js').InternalSupportBlock} InternalSupportBlock
 * @typedef {import('../../types/index.js').InternalSupportStatement} InternalSupportStatement
 */

// Once a category has been stripped of unsupported features, remove it from this list
const ignoredCategories = ['css'];

/**
 * Check if feature has never been implemented
 * @param {InternalSupportBlock} support The support statement
 * @returns {boolean} If the feature was never implemented
 */
export const neverImplemented = (support) => {
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
 * @param {InternalSupportBlock} support The support statement
 * @returns {LinterMessageLevel | false} Whether the feature should be removed from BCD
 */
export const implementedAndRemoved = (support) => {
  /** @type {LinterMessageLevel} */
  let result = 'error';
  for (const [
    browser,
    data,
  ] of /** @type {[BrowserName, InternalSupportStatement][]} */ (
    Object.entries(support)
  )) {
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
 * @param {Logger} logger The logger to output errors to
 * @param {CompatStatement} data The data to test
 * @returns {void}
 */
export const processData = (logger, data) => {
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

/** @type {Linter} */
export default {
  name: 'Obsolete',
  description: 'Test for obsolete data in each support statement',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data, path: { category } }) => {
    if (!ignoredCategories.includes(category)) {
      processData(logger, data);
    }
  },
  exceptions: ['html.elements.track.kind.descriptions'],
};
