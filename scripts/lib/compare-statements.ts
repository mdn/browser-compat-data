/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compareVersions } from 'compare-versions';

import { SimpleSupportStatement } from '../../types/types.js';

/**
 *
 *Sort a list of compatibility statements based upon reverse-chronological order in the following order:
 *1. Statements with only version added and/or removed (and potentially notes)
 *2. Statements with alternative names or prefixes
 *3. Statements with partial support
 *4. Statements with flags
 * @param {SimpleSupportStatement} a - The first support statement object to perform comparison with
 * @param {SimpleSupportStatement} b - The second support statement object to perform comparison with
 * @returns {number} Direction to sort
 */
const compareStatements = (
  a: SimpleSupportStatement,
  b: SimpleSupportStatement,
): number => {
  const has = {
    a: {
      unsupported: a.version_removed != undefined,
      flags: a.flags != undefined,
      altname: a.prefix != undefined || a.alternative_name != undefined,
      partial: a.partial_implementation != undefined,
    },
    b: {
      unsupported: b.version_removed != undefined,
      flags: b.flags != undefined,
      altname: b.prefix != undefined || b.alternative_name != undefined,
      partial: b.partial_implementation != undefined,
    },
  };

  if (has.a.unsupported && !has.b.unsupported) {
    return 1;
  }
  if (!has.a.unsupported && has.b.unsupported) {
    return -1;
  }

  if (has.a.flags && !has.b.flags) {
    return 1;
  }
  if (!has.a.flags && has.b.flags) {
    return -1;
  }

  if (has.a.altname && !has.b.altname) {
    return 1;
  }
  if (!has.a.altname && has.b.altname) {
    return -1;
  }

  if (has.a.partial && !has.b.partial) {
    return 1;
  }
  if (!has.a.partial && has.b.partial) {
    return -1;
  }

  if (
    typeof a.version_added == 'string' &&
    typeof b.version_added == 'string'
  ) {
    return compareVersions(
      b.version_added.replace('≤', ''),
      a.version_added.replace('≤', ''),
    );
  }

  return 0;
};

export default compareStatements;
