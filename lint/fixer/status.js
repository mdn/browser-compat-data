/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { checkExperimental } from '../linter/test-status.js';
import walk from '../../utils/walk.js';

/** @import {InternalCompatStatement, InternalIdentifier} from '../../types/index.js' */

/**
 * Fix the status values
 * @param {InternalIdentifier} value The value to update
 * @returns {InternalIdentifier} The updated value
 */
export const fixStatusValue = (value) => {
  const compat = value?.__compat;
  if (compat?.status) {
    if (compat.status.experimental && compat.status.deprecated) {
      compat.status.experimental = false;
    }

    if (compat.spec_url && compat.status.standard_track === false) {
      compat.status.standard_track = true;
    }

    if (!checkExperimental(compat)) {
      compat.status.experimental = false;
    }

    if (compat.status.deprecated) {
      // All sub-features are also deprecated.
      for (const subfeature of walk(undefined, value)) {
        if (subfeature.compat.status) {
          subfeature.compat.status.deprecated = true;
        }
      }
    }

    if (compat.status.experimental) {
      // All sub-features are also experimental, unless they are deprecated.
      for (const subfeature of walk(undefined, value)) {
        if (subfeature.compat.status && !subfeature.compat.status.deprecated) {
          subfeature.compat.status.experimental = true;
        }
      }
    }

    if (compat.status.standard_track === false) {
      // All sub-features are also experimental
      for (const subfeature of walk(undefined, value)) {
        if (subfeature.compat.status) {
          subfeature.compat.status.standard_track = false;
        }
      }
    }
  }

  return value;
};

/**
 * Fix feature statuses throughout the BCD files
 * @param {string} filename The name of the file to fix
 * @param {string} actual The current content of the file
 * @returns {string} expected content of the file
 */
const fixStatusFromFile = (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  return JSON.stringify(
    JSON.parse(actual, (_key, value) => fixStatusValue(value)),
    null,
    2,
  );
};

export default fixStatusFromFile;
