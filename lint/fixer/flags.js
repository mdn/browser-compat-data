/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import testFlags, {
  isIrrelevantFlagData,
  getBasicSupportStatement,
} from '../linter/test-flags.js';
import walk from '../../utils/walk.js';

/** @import {BrowserName, InternalCompatStatement, InternalSupportStatement, InternalSimpleSupportStatement, InternalIdentifier} from '../../types/index.js' */

/**
 * Removes irrelevant flags from the compatibility data
 * @param {InternalSupportStatement} supportData The compatibility statement to test
 * @returns {InternalSupportStatement} The compatibility statement with all of the flags removed
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

  /** @type {InternalSimpleSupportStatement[]} */
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
  return /** @type {[InternalSimpleSupportStatement, InternalSimpleSupportStatement, ...InternalSimpleSupportStatement[]]} */ (
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
      /** @type {InternalIdentifier & {__compat: InternalCompatStatement}} */ (
        feature.data
      );

    for (const [
      browser,
      supportData,
    ] of /** @type {[BrowserName, InternalSupportStatement][]} */ (
      Object.entries(feature.compat.support)
    )) {
      featureData.__compat.support[browser] =
        removeIrrelevantFlags(supportData);
    }
  }

  return JSON.stringify(data, null, 2);
};

export default fixFlags;
