/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @typedef {import('../../types/index.js').InternalSupportStatement} InternalSupportStatement
 * @typedef {import('../../types/types.js').CompatStatement} CompatStatement
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';

import { IS_WINDOWS } from '../../lint/utils.js';
import { dataFoldersMinusBrowsers } from '../lib/data-folders.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Check to see if the key is __compat and set 'webview_ios' to 'mirror'
 * @param {string} key The key in the object
 * @param {CompatStatement} value The value of the key
 * @returns {CompatStatement} The new value with 'webview_ios' set to 'mirror'
 */
export const doSetWebViewIOSToMirror = (key, value) => {
  if (key === '__compat') {
    if (value.support.webview_ios === undefined) {
      /** @type {InternalSupportStatement} */ (value.support).webview_ios =
        'mirror';
    }
  }
  return value;
};

/**
 * Set '__compat.support.webview_ios' to 'mirror' within all the data in a
 * specified file. The function will then automatically write any needed
 * changes back into the file.
 * @param {string} filename The filename to perform migration upon
 * @returns {void}
 */
export const setWebViewIOSToMirror = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, doSetWebViewIOSToMirror),
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
 * and perform setting '__compat.support.webview_ios' to 'mirror' for.
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
        setWebViewIOSToMirror(file);
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
