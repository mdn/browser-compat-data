/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { walk } from '../../utils/index.js';

/** @import {InternalSupportBlock} from '../../types/index.js' */

/**
 * Fixes common errors in an InternalSupportBlock.
 *
 * - Replaces `browser: { version_added: "mirror" }` with `browser: "mirror"`
 * - Wraps `browser: false` with `browser: `{ version_added: false }`
 * @param {InternalSupportBlock} support The support block to fix
 * @returns {void}
 */
export const fixCommonErrorsInSupportBlock = (support) => {
  for (const browser of Object.keys(support)) {
    if (support[browser] === false) {
      support[browser] = {
        version_added: false,
      };
    } else if (
      typeof support[browser] === 'object' &&
      JSON.stringify(support[browser]) === '{"version_added":"mirror"}'
    ) {
      support[browser] = 'mirror';
    }
    if (
      browser == 'ie' &&
      JSON.stringify(support[browser]) === '{"version_added":false}'
    ) {
      Reflect.deleteProperty(support, browser);
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
    fixCommonErrorsInSupportBlock(compat.support);
  }

  return JSON.stringify(bcd, null, 2);
};

export default fixCommonErrors;
