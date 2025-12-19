/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';

import walk from '../../utils/walk.js';

/**
 * @typedef {import('../utils.js').Linter} Linter
 * @typedef {import('../utils.js').Logger} Logger
 * @typedef {import('../utils.js').LinterData} LinterData
 * @typedef {import('../../types/types.js').CompatData} CompatData
 */

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
      for (const subfeature of walk(undefined, feature.data)) {
        if (subfeature.compat.status?.deprecated === false) {
          logger.error(
            chalk`{red Feature {italic ${feature.path}} is {bold deprecated}, but subfeature {italic ${subfeature.path}} is {bold not deprecated}.}`,
            { fixable: true },
          );
        }
      }
    }
    // If a feature is experimental, all sub-features are also experimental, unless they are deprecated.
    if (feature.compat.status?.experimental === true) {
      for (const subfeature of walk(undefined, feature.data)) {
        if (
          subfeature.compat.status?.experimental === false &&
          subfeature.compat.status?.deprecated === false
        ) {
          logger.error(
            chalk`{red Feature {italic ${feature.path}} is {bold experimental}, but subfeature {italic ${subfeature.path}} is {bold not experimental}.}`,
            { fixable: true },
          );
        }
      }
    }
    // If a feature is not standardized, then all sub-features aren't either.
    if (feature.compat.status?.standard_track === false) {
      for (const subfeature of walk(undefined, feature.data)) {
        if (subfeature.compat.status?.standard_track === true) {
          logger.error(
            chalk`{red Feature {italic ${feature.path}} is {bold not standardized}, but subfeature {italic ${subfeature.path}} is {bold standardized}.}`,
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
    checkStatusInheritance(data, logger);
  },
};
