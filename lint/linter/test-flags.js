/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { styleText } from 'node:util';

import { compare } from 'compare-versions';

/** @import {Linter, LinterData} from '../types.js' */
/** @import {Logger} from '../utils.js' */
/** @import {CompatStatement, BrowserName, SupportStatement, SimpleSupportStatement, FlagStatement} from '../../types/types.js' */

/**
 * @typedef {object} FlagError
 * @property {FlagStatement[]} flagData
 * @property {BrowserName} browser
 */

/**
 * Get the support statement with basic, non-aliased and non-flagged support
 * @param {SimpleSupportStatement[]} supportData The statements to check
 * @returns {SimpleSupportStatement | undefined} The support statement with basic, non-aliased and non-flagged support
 */
export const getBasicSupportStatement = (supportData) =>
  supportData.find((statement) => {
    const ignoreKeys = new Set([
      'version_removed',
      'notes',
      'partial_implementation',
    ]);
    const keys = Object.keys(statement).filter((key) => !ignoreKeys.has(key));
    return keys.length === 1;
  });

/**
 * Determines if a support statement is for irrelevant flag data
 * @param {SimpleSupportStatement} statement The statement to check
 * @param {SimpleSupportStatement | undefined} basicSupport The support statement for the same browser that has no alt. name, prefix or flag
 * @returns {boolean} Whether the support statement is irrelevant
 */
export const isIrrelevantFlagData = (statement, basicSupport) => {
  // If the statement has no flag data, it can't be "irrelevant flag data"
  if (!statement.flags) {
    return false;
  }

  // Any flag data with a version_removed is irrelevant
  if (statement.version_removed) {
    return true;
  }

  if (basicSupport) {
    // If support is only available in preview browsers...
    if (basicSupport.version_added === 'preview') {
      // ...then we still want to keep the flag data
      return false;
    }

    // If the basic support has been removed...
    if (basicSupport.version_removed) {
      // ...and the flag was added before basic support was removed...
      if (
        typeof basicSupport.version_removed === 'string' &&
        typeof statement.version_added === 'string' &&
        compare(
          /** @type {string} */ (statement.version_added).replace('≤', ''),
          /** @type {string} */ (basicSupport.version_removed).replace('≤', ''),
          '<',
        )
      ) {
        // ...it's irrelevant
        return true;
      }
      // Otherwise, it's still relevant
      return false;
    }

    // If there's basic support that's still present today, any flag can be considered irrelevant
    return true;
  }

  // If any of the above conditions could not be met, it's not irrelevant
  return false;
};
/**
 * Process data and check for any irrelevant flag data
 * @param {CompatStatement} data The data to test
 * @returns {FlagError[]} The errors found
 */
export const processData = (data) => {
  /** @type {FlagError[]} */
  const errors = [];

  for (const [
    browser,
    supportData,
  ] of /** @type {[BrowserName, SupportStatement][]} */ (
    Object.entries(data.support)
  )) {
    if (typeof supportData === 'string') {
      continue;
    }

    if (!Array.isArray(supportData)) {
      if (supportData.flags && isIrrelevantFlagData(supportData, undefined)) {
        errors.push({ flagData: supportData.flags, browser });
      }
    } else {
      const basicSupport = getBasicSupportStatement(supportData);

      for (const statement of supportData) {
        if (statement.flags && isIrrelevantFlagData(statement, basicSupport)) {
          errors.push({ flagData: statement.flags, browser });
        }
      }
    }
  }

  return errors;
};

/** @type {Linter} */
export default {
  name: 'Flag data',
  description: 'Test the flag data for any irrelevant flags',
  scope: 'feature',
  exceptions: ['api.Notification.requireInteraction', 'api.Window.dump'],
  /**
   * Test the data
   * @param {Logger} logger The logger to output errors to
   * @param {LinterData} root The data to test
   */
  check: (logger, { data }) => {
    const errors = processData(/** @type {CompatStatement} */ (data));

    for (const error of errors) {
      logger.error(
        `Irrelevant flag data detected for ${styleText('bold', error.browser)}. Remove statement with ${styleText('bold', error.flagData.map((flag) => flag.name).join(', '))} flag`,
        { fixable: true },
      );
    }
  },
};
