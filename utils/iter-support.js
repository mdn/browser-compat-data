/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {import('../types/types.js').CompatStatement} CompatStatement
 * @typedef {import('../types/types.js').BrowserName} BrowserName
 * @typedef {import('../types/types.js').SimpleSupportStatement} SimpleSupportStatement
 */

/**
 * Get support for a specific browser in array form
 * @param {CompatStatement} compat The compatibility data
 * @param {BrowserName} browser The browser to get data for
 * @returns {SimpleSupportStatement[]} The array of support statements for the browser
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
