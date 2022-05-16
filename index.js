/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs');
const { fdir } = require('fdir');

class DuplicateCompatError extends Error {
  constructor(feature) {
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
  let result = {};

  for (const dir of dirs) {
    const paths = new fdir()
      .withBasePath()
      .filter((fp) => fp.endsWith('.json'))
      .crawl(dir)
      .sync();

    for (const fp of paths) {
      try {
        extend(result, JSON.parse(fs.readFileSync(fp)));
      } catch (e) {
        // Skip invalid JSON. Tests will flag the problem separately.
        continue;
      }
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
