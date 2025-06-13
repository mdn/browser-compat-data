/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { compareVersions } from 'compare-versions';

import { SimpleSupportStatement } from '../../types/types.js';

/**
 *
 *Sort a list of compatibility statements based upon reverse-chronological order in the following order:
 * 1. Statements with only version added (and potentially notes)
 * 2. Statements with alternative names or prefixes
 * 3. Statements with partial support
 * 4. Statements with flags
 * 5. Statements with a version removed (or otherwise no support)
 * @param a - The first support statement object to perform comparison with
 * @param b - The second support statement object to perform comparison with
 * @returns Direction to sort
 */
const compareStatements = (
  a: SimpleSupportStatement,
  b: SimpleSupportStatement,
): number => {
  // Has version removed
  if (a.version_removed && !b.version_removed) {
    return 1;
  }
  if (!a.version_removed && b.version_removed) {
    return -1;
  }
  if (
    a.version_removed &&
    b.version_removed &&
    typeof a.version_removed == 'string' &&
    typeof b.version_removed == 'string'
  ) {
    // If both statements have version_removed, sort by removal version
    const cmp = compareVersions(
      b.version_removed.replace('≤', ''),
      a.version_removed.replace('≤', ''),
    );

    // If both statements were removed at same time, compare other parts
    if (cmp !== 0) {
      return cmp;
    }
  }

  // Has flags
  if (a.flags && !b.flags) {
    return 1;
  }
  if (!a.flags && b.flags) {
    return -1;
  }

  if (a.partial_implementation && !b.partial_implementation) {
    return 1;
  }
  if (!a.partial_implementation && b.partial_implementation) {
    return -1;
  }

  // Alternative name
  const a_altname = a.prefix != undefined || a.alternative_name != undefined;
  const b_altname = b.prefix != undefined || b.alternative_name != undefined;
  if (a_altname && !b_altname) {
    return 1;
  }
  if (!a_altname && b_altname) {
    return -1;
  }

  if (
    typeof a.version_added == 'string' &&
    typeof b.version_added == 'string'
  ) {
    switch ('preview') {
      case a.version_added:
        return -1;

      case b.version_added:
        return 1;

      default:
        return compareVersions(
          b.version_added.replace('≤', ''),
          a.version_added.replace('≤', ''),
        );
    }
  }

  return 0;
};

export default compareStatements;
