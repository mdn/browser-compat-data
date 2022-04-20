/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');

class DuplicateCompatError extends Error {
  constructor(message) {
    super(`${feature} already exists! Remove duplicate entries.`);
    this.name = 'DuplicateCompatError';
  }
}

/**
 * Recursively load one or more files and/or directories passed as arguments.
 *
 * @param {string[]} files The files to test
 * @returns {object} All of the browser compatibility data
 */
function load(...files) {
  let dir,
    result = {};

  for (dir of files) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(fn => {
      const fp = path.join(dir, fn);
      let extra;

      if (fs.statSync(fp).isDirectory()) {
        // If the given filename is a directory, recursively load it.
        extra = load(fp);
      } else if (path.extname(fp) === '.json') {
        try {
          extra = JSON.parse(fs.readFileSync(fp));
        } catch (e) {
          // Skip invalid JSON. Tests will flag the problem separately.
          return;
        }
      } else {
        // Skip anything else, such as *~ backup files or similar.
        return;
      }

      // The JSON data is independent of the actual file
      // hierarchy, so it is essential to extend "deeply".
      extend(result, extra);
    });
  }

  return result;
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function extend(target, source, feature = '') {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new Error('Both target and source must be plain objects');
  }

  // iterate over own enumerable properties
  for (const [key, value] of Object.entries(source)) {
    // recursively extend if target has the same key, otherwise just assign
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      if (key == '__compat') {
        // If attempting to merge __compat, we have a double-entry
        throw new DuplicateCompatError(feature);
      }
      extend(target[key], value, feature + `${feature ? '.' : ''}${key}`);
    } else {
      target[key] = value;
    }
  }
}

module.exports = load(
  'api',
  'browsers',
  'css',
  'html',
  'http',
  'javascript',
  'mathml',
  'svg',
  'webdriver',
  'webextensions',
);
