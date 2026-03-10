/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import testFlags, {
  isIrrelevantFlagData,
  getBasicSupportStatement,
} from '../linter/test-flags.js';
import walk from '../../utils/walk.js';

/** @import {BrowserName, CompatStatement, SupportStatement, SimpleSupportStatement, Identifier} from '../../types/types.js' */

/**
 * Removes irrelevant flags from the compatibility data
 * @param {SupportStatement} supportData The compatibility statement to test
 * @returns {SupportStatement} The compatibility statement with all of the flags removed
 */
export const removeIrrelevantFlags = (supportData) => {
  if (typeof supportData === 'string') {
    return supportData;
  }

  if (!Array.isArray(supportData)) {
    if (isIrrelevantFlagData(supportData, undefined)) {
      return { version_added: false };
    }

    return supportData;
  }

  /** @type {SimpleSupportStatement[]} */
  const result = [];
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
  return /** @type {[SimpleSupportStatement, SimpleSupportStatement, ...SimpleSupportStatement[]]} */ (
    result
  );
};

/**
 * Removes irrelevant flags from the compatibility data of a specified file
 * @param {string} filename The filename containing compatibility info
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixFlags = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const data = JSON.parse(actual);
  const walker = walk(undefined, data);

  for (const feature of walker) {
    if (testFlags.exceptions?.includes(feature.path)) {
      continue;
    }

    const featureData =
      /** @type {Identifier & {__compat: CompatStatement}} */ (feature.data);

    for (const [
      browser,
      supportData,
    ] of /** @type {[BrowserName, SupportStatement][]} */ (
      Object.entries(feature.compat.support)
    )) {
      featureData.__compat.support[browser] =
        removeIrrelevantFlags(supportData);
    }
  }

  return JSON.stringify(data, null, 2);
};

export default fixFlags;
