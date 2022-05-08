/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

'use strict';

/**
 * @typedef {import('../../types').Identifier} Identifier
 */

const fs = require('fs');
const path = require('path');
const { platform } = require('os');

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

/**
 * Return a new "support_block" object whose first-level properties
 * (browser names) have been ordered according to Array.prototype.sort,
 * and so will be stringified in that order as well. This relies on
 * guaranteed "own" property ordering, which is insertion order for
 * non-integer keys (which is our case).
 *
 * @param {string} key The key of the object
 * @param {Identifier} value The value of the key
 * @returns {Identifier} Value with sorting applied
 */
const orderSupportBlock = (key, value) => {
  if (key === '__compat') {
    value.support = Object.keys(value.support)
      .sort()
      .reduce((result, key) => {
        result[key] = value.support[key];
        return result;
      }, {});
  }
  return value;
};

/**
 * Perform a fix of the browser order of a __compat.support block within all the data in a specified file.  The function will then automatically write any needed changes back into the file.
 *
 * @param {string} filename The filename to perform fix upon
 * @returns {void}
 */
const fixBrowserOrder = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderSupportBlock), null, 2);

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
   * @param {string[]} files
   */
  function load(...files) {
    for (let file of files) {
      if (file.indexOf(__dirname) !== 0) {
        file = path.resolve(__dirname, '..', file);
      }

      if (!fs.existsSync(file)) {
        continue; // Ignore non-existent files
      }

      if (fs.statSync(file).isFile()) {
        if (path.extname(file) === '.json') {
          fixBrowserOrder(file);
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

module.exports = fixBrowserOrder;
