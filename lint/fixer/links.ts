/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { IS_WINDOWS } from '../utils.js';
import { processData } from '../linter/test-links.js';

/**
 * Fix issues with links throughout the BCD files
 * @param filename The name of the file to fix
 * @param actual The current content of the file
 * @returns expected content of the file
 */
const fixLinks = async (filename: string, actual: string): Promise<string> => {
  if (filename.includes('/browsers/')) {
    return actual;
  }

  const errors = await processData(actual);
  let expected = actual;

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    expected = expected.replace(/\r/g, '');
  }

  for (const error of errors) {
    if (error.expected) {
      expected = expected.replace(error.actual, error.expected);
    }
  }

  return expected;
};

export default fixLinks;
