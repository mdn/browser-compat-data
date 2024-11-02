/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import chalk from 'chalk-template';
import { compare } from 'compare-versions';

import { Linter, Logger, LinterData } from '../utils.js';
import {
  CompatStatement,
  BrowserName,
  SupportStatement,
  SimpleSupportStatement,
  FlagStatement,
} from '../../types/types.js';

interface FlagError {
  flagData: FlagStatement[];
  browser: BrowserName;
}

/**
 * Get the support statement with basic, non-aliased and non-flagged support
 * @param supportData The statements to check
 * @returns The support statement with basic, non-aliased and non-flagged support
 */
export const getBasicSupportStatement = (
  supportData: SimpleSupportStatement[],
): SimpleSupportStatement | undefined =>
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
 * @param statement The statement to check
 * @param basicSupport The support statement for the same browser that has no alt. name, prefix or flag
 * @returns Whether the support statement is irrelevant
 */
export const isIrrelevantFlagData = (
  statement: SimpleSupportStatement,
  basicSupport: SimpleSupportStatement | undefined,
) => {
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
          (statement.version_added as string).replace('≤', ''),
          (basicSupport.version_removed as string).replace('≤', ''),
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
 * @param data The data to test
 * @returns The errors found
 */
export const processData = (data: CompatStatement): FlagError[] => {
  const errors: FlagError[] = [];

  for (const [browser, supportData] of Object.entries(data.support) as [
    BrowserName,
    SupportStatement,
  ][]) {
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

export default {
  name: 'Flag data',
  description: 'Test the flag data for any irrelevant flags',
  scope: 'feature',
  exceptions: ['api.Notification.requireInteraction', 'api.Window.dump'],
  /**
   * Test the data
   * @param logger The logger to output errors to
   * @param root The data to test
   * @param root.data The feature data
   */
  check: (logger: Logger, { data }: LinterData) => {
    const errors = processData(data);

    for (const error of errors) {
      logger.error(
        chalk`Irrelevant flag data detected for {bold ${
          error.browser
        }}. Remove statement with {bold ${error.flagData
          .map((flag) => flag.name)
          .join(', ')}} flag`,
        { fixable: true },
      );
    }
  },
} as Linter;
