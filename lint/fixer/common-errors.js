/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { walk } from '../../utils/index.js';

/**
 * @typedef {import('../../types/types.js').CompatStatement} CompatStatement
 * @typedef {import('../../types/types.js').SimpleSupportStatement} SimpleSupportStatement
 */

/**
 * Fixes common errors in CompatStatements.
 *
 * - Replaces `browser: { version_added: "mirror" }` with `browser: "mirror"`
 * - Wraps `browser: false` with `browser: `{ version_added: false }`
 * @param {CompatStatement} compat The compat statement to fix
 * @returns {void}
 */
export const fixCommonErrorsInCompatStatement = (compat) => {
  for (const browser of Object.keys(compat.support)) {
    if (compat.support[browser] === false) {
      compat.support[browser] = /** @type {SimpleSupportStatement} */ ({
        version_added: false,
      });
    } else if (
      typeof compat.support[browser] === 'object' &&
      JSON.stringify(compat.support[browser]) === '{"version_added":"mirror"}'
    ) {
      compat.support[browser] = 'mirror';
    }
    if (
      browser == 'ie' &&
      JSON.stringify(compat.support[browser]) === '{"version_added":false}'
    ) {
      Reflect.deleteProperty(compat.support, browser);
    }
  }
};

/**
 * Update compat data to 'mirror' if the statement matches mirroring
 * @param {string} filename The name of the file to fix
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixCommonErrors = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const bcd = JSON.parse(actual);

  for (const { compat } of walk(undefined, bcd)) {
    fixCommonErrorsInCompatStatement(compat);
  }

  return JSON.stringify(bcd, null, 2);
};

export default fixCommonErrors;
