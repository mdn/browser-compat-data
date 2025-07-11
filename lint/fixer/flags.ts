/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  BrowserName,
  SupportStatement,
  SimpleSupportStatement,
} from '../../types/types.js';
import testFlags, {
  isIrrelevantFlagData,
  getBasicSupportStatement,
} from '../linter/test-flags.js';
import walk from '../../utils/walk.js';

/**
 * Removes irrelevant flags from the compatibility data
 * @param supportData The compatibility statement to test
 * @returns The compatibility statement with all of the flags removed
 */
export const removeIrrelevantFlags = (
  supportData: SupportStatement,
): SupportStatement => {
  if (typeof supportData === 'string') {
    return supportData;
  }

  if (!Array.isArray(supportData)) {
    if (isIrrelevantFlagData(supportData, undefined)) {
      return { version_added: false };
    }

    return supportData;
  }

  const result: SimpleSupportStatement[] = [];
  const basicSupport = getBasicSupportStatement(supportData);

  for (const statement of supportData) {
    if (!isIrrelevantFlagData(statement, basicSupport)) {
      result.push(statement);
    }
  }

  if (result.length == 0) {
    return { version_added: false };
  }
  if (result.length == 1) {
    return result[0];
  }
  return result as [
    SimpleSupportStatement,
    SimpleSupportStatement,
    ...SimpleSupportStatement[],
  ];
};

/**
 * Removes irrelevant flags from the compatibility data of a specified file
 * @param filename The filename containing compatibility info
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixFlags = (filename: string, actual: string): string => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  const walker = walk(undefined, data);

  for (const feature of walker) {
    if (testFlags.exceptions?.includes(feature.path)) {
      continue;
    }

    for (const [browser, supportData] of Object.entries(
      feature.compat.support,
    ) as [BrowserName, SupportStatement][]) {
      feature.data.__compat.support[browser] =
        removeIrrelevantFlags(supportData);
    }
  }

  return JSON.stringify(data, null, 2);
};

export default fixFlags;
