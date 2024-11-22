/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';

import { IS_WINDOWS } from '../utils.js';
import { processData } from '../linter/test-links.js';

/**
 * Fix issues with links throughout the BCD files
 * @param filename The name of the file to fix
 */
const fixLinks = async (filename: string): Promise<void> => {
  if (filename.includes('/browsers/')) {
    return;
  }

  const original = fs.readFileSync(filename, 'utf-8').trim();
  const errors = await processData(original);
  let data = original;

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    data = data.replace(/\r/g, '');
  }

  for (const error of errors) {
    if (error.expected) {
      data = data.replace(error.actual, error.expected);
    }
  }

  if (original !== data) {
    fs.writeFileSync(filename, data + '\n', 'utf-8');
  }
};

export default fixLinks;
