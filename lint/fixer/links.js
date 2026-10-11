/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { IS_WINDOWS } from '../utils.js';
import { processData } from '../linter/test-links.js';

/**
 * Fix issues with links throughout the BCD files
 * @param {string} filename The name of the file to fix
 * @param {string} actual The current content of the file
 * @returns {Promise<string>} expected content of the file
 */
const fixLinks = async (filename, actual) => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const errors = await processData(actual);
  let expected = actual;

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    expected = expected.replace(/\r/g, '');
  }

  const replacements = errors.flatMap((error) => {
    if (!error.expected) {
      return [];
    }

    return [{ start: error.errorIndex, ...error }];
  });

  replacements.sort((a, b) => b.start - a.start);
  for (const replacement of replacements) {
    expected =
      expected.slice(0, replacement.start) +
      replacement.expected +
      expected.slice(replacement.start + replacement.actual.length);
  }

  return expected;
};

export default fixLinks;
