/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { checkOverlap } from '../common/overlap.js';

/**
 * @typedef {import('../utils.js').Linter} Linter
 * @typedef {import('../utils.js').Logger} Logger
 * @typedef {import('../utils.js').LinterData} LinterData
 * @typedef {import('../../types/types.js').BrowserName} BrowserName
 * @typedef {import('../../types/types.js').SupportStatement} SupportStatement
 */

/** @type {Linter} */
export default {
  name: 'Overlap',
  description: 'Ensure there are no statements with overlapping version ranges',
  scope: 'feature',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    for (const [browser, support] of Object.entries(data.support)) {
      checkOverlap(
        /** @type {SupportStatement} */ (support),
        /** @type {BrowserName} */ (browser),
        {
          logger,
        },
      );
    }
  },
};
