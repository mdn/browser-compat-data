/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import {
  CompatStatement,
  BrowserName,
  SimpleSupportStatement,
} from '../types/types.js';

/**
 * Get support for a specific browser in array form
 * @param compat The compatibility data
 * @param browser The browser to get data for
 * @returns The array of support statements for the browser
 */
export default (
  compat: CompatStatement,
  browser: BrowserName,
): SimpleSupportStatement[] => {
  if (browser in compat.support) {
    const data = compat.support[browser];
    if (data) {
      return Array.isArray(data) ? data : [data];
    }
  }

  return [{ version_added: false }];
};
