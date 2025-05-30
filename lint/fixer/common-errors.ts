/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { CompatStatement, SimpleSupportStatement } from '../../types/types.js';
import { walk } from '../../utils/index.js';

/**
 * Fixes common errors in CompatStatements.
 *
 * - Replaces `browser: { version_added: "mirror" }` with `browser: "mirror"`
 * - Wraps `browser: false` with `browser: `{ version_added: false }`
 *
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
  }
};

/**
 * Update compat data to 'mirror' if the statement matches mirroring
 * @param filename The name of the file to fix
 */
const fixCommonErrors = (filename: string): void => {
  if (filename.includes('/browsers/')) {
    return;
  }

  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const bcd = JSON.parse(actual);
  for (const { compat } of walk(undefined, bcd)) {
    fixCommonErrorsInCompatStatement(compat);
  }
  const expected = JSON.stringify(bcd, null, 2);

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

export default fixCommonErrors;
