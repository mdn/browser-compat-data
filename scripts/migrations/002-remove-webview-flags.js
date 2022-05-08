/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

const fs = require('fs');
const path = require('path');
const { platform } = require('os');

/**
 * Determines if the OS is Windows
 *
 * @constant {boolean}
 */
const IS_WINDOWS = platform() === 'win32';

/**
 * Recursively load one or more files and/or directories passed as arguments and perform feature sorting.
 *
 * @param {string} key The key in the object
 * @param {Identifier} value The value of the key
 * @returns {Identifier} The new value with WebView flags removed
 */
const removeWebViewFlags = (key, value) => {
  if (key === '__compat') {
    if (value.support.webview_android !== undefined) {
      if (Array.isArray(value.support.webview_android)) {
        const result = [];
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
 * Perform removal of flags within WebView data within all the data in a specified file.  The function will then automatically write any needed changes back into the file.
 *
 * @param {string} filename The filename to perform migration upon
 */
const fixWebViewFlags = (filename) => {
  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const expected = JSON.stringify(
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

if (require.main === module) {
  /**
   * Recursively load one or more files and/or directories passed as arguments and perform removal of flags from WebView support data.
   *
   * @param {string[]} files The files to load and perform migration upon
   * @returns {void}
   */
  function load(...files) {
    for (let file of files) {
      if (file.indexOf(__dirname) !== 0) {
        file = path.resolve(__dirname, '..', '..', file);
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

      const subFiles = fs.readdirSync(file).map((subfile) => {
        return path.join(file, subfile);
      });

      load(...subFiles);
    }
  }

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
      'webdriver',
      'webextensions',
    );
  }
}

module.exports = { removeWebViewFlags, fixWebViewFlags };
