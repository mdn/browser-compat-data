/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs');
const path = require('path');

class DuplicateCompatError extends Error {
  constructor(feature) {
    super(`${feature} already exists! Remove duplicate entries.`);
    this.name = 'DuplicateCompatError';
  }
}

function load() {
  // Recursively load one or more directories passed as arguments.
  let dir,
    result = {};

  function processFilename(fn) {
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
  }

  for (dir of arguments) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(processFilename);
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
