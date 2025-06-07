/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { CompatStatement, SimpleSupportStatement } from '../../types/types.js';
import { walk } from '../../utils/index.js';

/**
 * Fixes common errors in CompatStatements.
 *
 * - Replaces `browser: { version_added: "mirror" }` with `browser: "mirror"`
 * - Wraps `browser: false` with `browser: `{ version_added: false }`
 * @param compat The compat statement to fix
 */
export const fixCommonErrorsInCompatStatement = (
  compat: CompatStatement,
): void => {
  for (const browser of Object.keys(compat.support)) {
    if (compat.support[browser] === false) {
      compat.support[browser] = {
        version_added: false,
      } satisfies SimpleSupportStatement;
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
 * @param filename The name of the file to fix
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixCommonErrors = (filename: string, actual: string): string => {
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
