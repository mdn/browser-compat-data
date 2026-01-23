/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { checkOverlap } from '../common/overlap.js';

/** @import {Linter, Logger, LinterData} from '../utils.js' */
/** @import {BrowserName, SupportStatement} from '../../types/types.js' */

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
