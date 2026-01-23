/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {CompatStatement} from '../../types/types.js' */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';

import { IS_WINDOWS } from '../../lint/utils.js';
import { dataFoldersMinusBrowsers } from '../lib/data-folders.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Check to see if the key is __compat and convert descriptions to markdown
 * @param {string} key The key in the object
 * @param {CompatStatement} value The value of the key
 * @returns {CompatStatement} The new value with descriptions converted to markdown
 */
export const doDescriptionsToMarkdown = (key, value) => {
  if (key === '__compat') {
    if (value.description) {
      value.description = value.description.replace(/<\/?code>/g, '`');
    }
  }
  return value;
};

/**
 * Convert descriptions to markdown within all the data in a
 * specified file. The function will then automatically write any needed
 * changes back into the file.
 * @param {string} filename The filename to perform migration upon
 * @returns {void}
 */
export const descriptionsToMarkdown = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, doDescriptionsToMarkdown),
    null,
    2,
  );

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

/**
 * Recursively load one or more files and/or directories passed as arguments
 * and perform converting descriptions to markdown.
 * @param {...string} files The files to load and perform migration upon
 * @returns {void}
 */
const load = (...files) => {
  for (let file of files) {
    if (file.indexOf(dirname) !== 0) {
      file = path.resolve(dirname, '..', '..', file);
    }

    if (!fs.existsSync(file)) {
      continue; // Ignore non-existent files
    }

    if (fs.statSync(file).isFile()) {
      if (path.extname(file) === '.json') {
        descriptionsToMarkdown(file);
      }

      continue;
    }

    const subFiles = fs
      .readdirSync(file)
      .map((subfile) => path.join(file, subfile));

    load(...subFiles);
  }
};

if (esMain(import.meta)) {
  if (process.argv[2]) {
    load(process.argv[2]);
  } else {
    load(...dataFoldersMinusBrowsers);
  }
}
