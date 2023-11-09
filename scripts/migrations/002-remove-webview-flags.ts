/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import esMain from 'es-main';

import { CompatStatement, SimpleSupportStatement } from '../../types/types.js';
import { IS_WINDOWS } from '../../test/utils.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Check to see if the key is __compat and modify the value to remove
 * flags from WebView Android.
 * @param {string} key The key in the object
 * @param {CompatStatement} value The value of the key
 * @returns {CompatStatement} The new value with WebView flags removed
 */
export const removeWebViewFlags = (
  key: string,
  value: CompatStatement,
): CompatStatement => {
  if (key === '__compat') {
    if (value.support.webview_android !== undefined) {
      if (Array.isArray(value.support.webview_android)) {
        const result: SimpleSupportStatement[] = [];
        for (let i = 0; i < value.support.webview_android.length; i++) {
          if (value.support.webview_android[i].flags === undefined) {
            result.push(value.support.webview_android[i]);
          }
        }

        if (result.length == 0) {
          value.support.webview_android = { version_added: false };
        } else if (result.length == 1) {
          value.support.webview_android = result[0];
        } else {
          value.support.webview_android = result;
        }
      } else if (value.support.webview_android.flags !== undefined) {
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
 */
export const fixWebViewFlags = (filename: string): void => {
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
 * @param {string[]} files The files to load and perform migration upon
 */
const load = (...files: string[]): void => {
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
    load(
      'api',
      'css',
      'html',
      'http',
      'svg',
      'javascript',
      'mathml',
      'test',
      'webassembly',
      'webdriver',
      'webextensions',
    );
  }
}
