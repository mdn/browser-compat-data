/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { Linter, Logger, LinterData } from '../utils.js';
import { BrowserName, SupportStatement } from '../../types/types.js';
import { checkOverlap } from '../common/overlap.js';

export default {
  name: 'Overlap',
  description: 'Ensure there are no statements with overlapping version ranges',
  scope: 'feature',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   */
  check: (logger: Logger, { data }: LinterData) => {
    for (const [browser, support] of Object.entries(data.support)) {
      checkOverlap(support as SupportStatement, browser as BrowserName, {
        logger,
      });
    }
  },
} as Linter;
