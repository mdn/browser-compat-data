/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement, BrowserName, InternalSimpleSupportStatement} from '../types/index.js' */

/**
 * Get support for a specific browser in array form
 * @param {Pick<InternalCompatStatement, "support">} compat The compatibility data
 * @param {BrowserName} browser The browser to get data for
 * @returns {InternalSimpleSupportStatement[]} The array of support statements for the browser
 */
export default (compat, browser) => {
  if (browser in compat.support) {
    const data = compat.support[browser];
    if (data) {
      return Array.isArray(data) ? data : [data];
    }
  }

  return [{ version_added: false }];
};
