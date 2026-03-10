/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import walk from '../../utils/walk.js';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatData, Identifier} from '../../types/types.js' */

/**
 * Checks for correct inheritance of statuses.
 * @param {CompatData} data The data to test
 * @param {Logger} logger The logger to output errors to
 * @returns {void}
 */
const checkStatusInheritance = (data, logger) => {
  for (const feature of walk(undefined, data)) {
    // If a feature is deprecated, all sub-features are also deprecated.
    if (feature.compat.status?.deprecated === true) {
      for (const subfeature of walk(
        undefined,
        /** @type {Identifier} */ (feature.data),
      )) {
        if (subfeature.compat.status?.deprecated === false) {
          logger.error(
            styleText(
              'red',
              `Feature ${styleText('italic', feature.path)} is ${styleText('bold', 'deprecated')}, but subfeature ${styleText('italic', subfeature.path)} is ${styleText('bold', 'not deprecated')}.`,
            ),
            { fixable: true },
          );
        }
      }
    }
    // If a feature is experimental, all sub-features are also experimental, unless they are deprecated.
    if (feature.compat.status?.experimental === true) {
      for (const subfeature of walk(
        undefined,
        /** @type {Identifier} */ (feature.data),
      )) {
        if (
          subfeature.compat.status?.experimental === false &&
          subfeature.compat.status?.deprecated === false
        ) {
          logger.error(
            styleText(
              'red',
              `Feature ${styleText('italic', feature.path)} is ${styleText('bold', 'experimental')}, but subfeature ${styleText('italic', subfeature.path)} is ${styleText('bold', 'not experimental')}.`,
            ),
            { fixable: true },
          );
        }
      }
    }
    // If a feature is not standardized, then all sub-features aren't either.
    if (feature.compat.status?.standard_track === false) {
      for (const subfeature of walk(
        undefined,
        /** @type {Identifier} */ (feature.data),
      )) {
        if (subfeature.compat.status?.standard_track === true) {
          logger.error(
            styleText(
              'red',
              `Feature ${styleText('italic', feature.path)} is ${styleText('bold', 'not standardized')}, but subfeature ${styleText('italic', subfeature.path)} is ${styleText('bold', 'standardized')}.`,
            ),
            { fixable: true },
          );
        }
      }
    }
  }
};

/** @type {Linter} */
export default {
  name: 'Status inheritance',
  description: 'Test for status inheritance',
  scope: 'tree',
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    checkStatusInheritance(/** @type {CompatData} */ (data), logger);
  },
};
