/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

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
 * Recursively load one or more directories passed as arguments.
 *
 * @param {string[]} dirs The directories to load
 * @returns {object} All of the browser compatibility data
 */
function load(...dirs) {
  let dir,
    result = {};

  for (dir of dirs) {
    dir = path.isAbsolute(dir) ? dir : path.resolve(__dirname, dir);
    const files = fs.readdirSync(dir);
    for (const fn of files) {
      const abspath = path.resolve(__dirname, dir, entry);
      let extra;

      if (fs.statSync(abspath).isDirectory()) {
        // If the given filename is a directory, recursively load it.
        extra = load(abspath);
      } else if (path.extname(abspath) === '.json') {
        try {
          extra = JSON.parse(fs.readFileSync(abspath));
        } catch (e) {
          // Skip invalid JSON. Tests will flag the problem separately.
          continue;
        }
      } else {
        // Skip anything else, such as *~ backup files or similar.
        continue;
      }

      // The JSON data is independent of the actual file
      // hierarchy, so it is essential to extend "deeply".
      extend(result, extra);
    }
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
