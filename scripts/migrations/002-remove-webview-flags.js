/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {InternalCompatStatement, InternalSimpleSupportStatement, InternalSupportStatement} from '../../types/index.js' */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';

import { IS_WINDOWS } from '../../lint/utils.js';
import { dataFoldersMinusBrowsers } from '../lib/data-folders.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Check to see if the key is __compat and modify the value to remove
 * flags from WebView Android.
 * @param {string} key The key in the object
 * @param {InternalCompatStatement} value The value of the key
 * @returns {InternalCompatStatement} The new value with WebView flags removed
 */
export const removeWebViewFlags = (key, value) => {
  if (key === '__compat') {
    if (value.support.webview_android !== undefined) {
      if (Array.isArray(value.support.webview_android)) {
        /** @type {InternalSimpleSupportStatement[]} */
        const result = [];
        for (const support of value.support.webview_android) {
          if (typeof support === 'object' && support.flags === undefined) {
            result.push(support);
          }
        }

        if (result.length == 0) {
          value.support.webview_android = { version_added: false };
        } else if (result.length == 1) {
          value.support.webview_android = result[0];
        } else {
          value.support.webview_android =
            /** @type {InternalSupportStatement} */ (result);
        }
      } else if (
        typeof value.support.webview_android === 'object' &&
        value.support.webview_android.flags !== undefined
      ) {
        value.support.webview_android = { version_added: false };
      }
    }
  }
  return value;
};

/**
 * Perform removal of flags within WebView data within all the data in a
 * specified file. The function will then automatically write any needed
 * changes back into the file.
 * @param {string} filename The filename to perform migration upon
 * @returns {void}
 */
export const fixWebViewFlags = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(
    JSON.parse(actual, removeWebViewFlags),
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
 * and perform removal of flags from WebView support data.
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
        fixWebViewFlags(file);
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
