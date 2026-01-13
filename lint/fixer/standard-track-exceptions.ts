/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import bcd from '../../index.js';
import { CompatStatement } from '../../types/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exceptionListPath = join(
  __dirname,
  '../linter/standard_track_without_spec_url.txt',
);

/**
 * Check if a feature should remain in the exception list.
 * A feature should be removed if it now has spec_url or standard_track is not true.
 * @param featurePath The full path to the feature
 * @returns True if the feature should remain in the exception list
 */
const shouldRemainInExceptionList = (featurePath: string): boolean => {
  // Navigate to the feature in the BCD data
  const parts = featurePath.split('.');
  let current: any = bcd;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      // Feature no longer exists
      return false;
    }
    current = current[part];
  }

  const compat = current?.__compat as CompatStatement | undefined;
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
 * @param filename The filename being processed (ignored for this fixer)
 * @param actual The current content (ignored for this fixer)
 * @returns The unchanged content (this fixer modifies the exception list file directly)
 */
const fixStandardTrackExceptions = async (
  filename: string,
  actual: string,
): Promise<string> => {
  // Only run once per fix session
  if (hasRun) {
    return actual;
  }
  hasRun = true;

  try {
    const content = await readFile(exceptionListPath, 'utf-8');
    const lines = content.split('\n');

    const headerLines: string[] = [];
    const featureLines: string[] = [];

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
      console.log(
        `Removed ${removed} feature(s) from standard_track_without_spec_url.txt exception list`,
      );

      // Reconstruct the file with header and remaining features
      const newContent = [
        ...headerLines,
        ...remainingFeatures.sort(),
        '', // trailing newline
      ].join('\n');

      await writeFile(exceptionListPath, newContent, 'utf-8');
    }
  } catch (error) {
    // Exception list file doesn't exist or can't be read, skip silently
  }

  return actual;
};

export default fixStandardTrackExceptions;
