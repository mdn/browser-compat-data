/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import bcd from '../../index.js';
import {
  exceptionListPath,
  getStandardTrackExceptions,
  setStandardTrackExceptions,
} from '../common/standard-track-exceptions.js';

/**
 * Check if a feature should remain in the exception list.
 * A feature should be removed if it now has spec_url or standard_track is not true.
 * @param {string} featurePath The full path to the feature
 * @returns {boolean} True if the feature should remain in the exception list
 */
const shouldRemainInExceptionList = (featurePath) => {
  // Navigate to the feature in the BCD data
  const parts = featurePath.split('.');
  /** @type {any} */
  let current = bcd;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      // Feature no longer exists
      return false;
    }
    current = current[part];
  }

  const compat = current?.__compat;
  if (!compat) {
    // No compat data, remove from list
    return false;
  }

  // Keep in exception list only if still missing spec_url AND standard_track is true
  return !compat.spec_url && compat.status?.standard_track === true;
};

// Flag to ensure this fixer only runs once per fix session
let hasRun = false;

/**
 * Update the standard_track exception list by removing features that no longer need to be there.
 * This fixer is special - it doesn't process individual files but updates the exception list itself.
 * @param {string} filename The filename being processed (ignored for this fixer)
 * @param {string} actual The current content (ignored for this fixer)
 * @returns {Promise<string>} The unchanged content (this fixer modifies the exception list file directly)
 */
const fixStandardTrackExceptions = async (filename, actual) => {
  if (hasRun) {
    // Only run once.
    return actual;
  }
  hasRun = true;

  const features = [...(await getStandardTrackExceptions())];

  // Filter features that should remain
  const remainingFeatures = features.filter((featurePath) =>
    shouldRemainInExceptionList(featurePath),
  );

  // Check if anything changed
  if (features.length !== remainingFeatures.length) {
    const removed = features.length - remainingFeatures.length;

    await setStandardTrackExceptions(remainingFeatures);

    console.log(`Removed ${removed} exceptions from ${exceptionListPath}`);
  }

  return actual;
};

export default fixStandardTrackExceptions;
