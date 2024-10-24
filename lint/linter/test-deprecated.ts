/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import { Linter, Logger, LinterData } from '../utils.js';
import { CompatData } from '../../types/types.js';
import walk from '../../utils/walk.js';

/**
 * Checks for correct inheritance of deprecated status.
 *
 * @param data The data to test
 * @param logger The logger to output errors to
 */
const checkDeprecated = (data: CompatData, logger: Logger) => {
  for (const feature of walk(undefined, data)) {
    if (feature.compat.status?.deprecated === true) {
      for (const subfeature of walk(undefined, feature.data)) {
        if (!subfeature.compat.status?.deprecated == true) {
          logger.error(
            chalk`{red Feature {italic ${feature.path}} is {bold deprecated}, but subfeature {italic ${subfeature.path}} is {bold not deprecated}.}`,
            { fixable: true },
          );
        }
      }
    }
  }
};

export default {
  name: 'Deprecated',
  description: 'Test for deprecation inheritance',
  scope: 'tree',
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The data to test
   */
  check: (logger: Logger, { data }: LinterData) => {
    checkDeprecated(data, logger);
  },
} as Linter;
