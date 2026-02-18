/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import bcd from '../../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exceptionListPath = join(
  __dirname,
  '../linter/standard_track_without_spec_url.txt',
);

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
  // Only run once per fix session
  if (hasRun) {
    return actual;
  }
  hasRun = true;

  try {
    const content = await readFile(exceptionListPath, 'utf-8');
    const lines = content.split('\n');

    /** @type {string[]} */
    const headerLines = [];
    /** @type {string[]} */
    const featureLines = [];

    // Separate header comments from feature lines
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed.length === 0) {
        headerLines.push(line);
      } else {
        featureLines.push(trimmed);
      }
    }

    // Filter features that should remain
    const remainingFeatures = featureLines.filter((featurePath) =>
      shouldRemainInExceptionList(featurePath),
    );

    // Check if anything changed
    if (remainingFeatures.length !== featureLines.length) {
      const removed = featureLines.length - remainingFeatures.length;

      // Reconstruct the file with header and remaining features
      const newContent = [
        ...headerLines,
        ...remainingFeatures.sort(),
        '', // trailing newline
      ].join('\n');

      await writeFile(exceptionListPath, newContent, 'utf-8');

      console.log(
        `Removed ${removed} feature(s) from standard_track_without_spec_url.txt exception list`,
      );
    }
  } catch {
    // Exception list file doesn't exist or can't be read, skip silently
  }

  return actual;
};

export default fixStandardTrackExceptions;
