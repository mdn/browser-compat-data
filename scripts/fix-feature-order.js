#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Return a new feature object whose first-level properties have been
 * ordered according to Array.prototype.sort, and so will be
 * stringified in that order as well. This relies on guaranteed "own"
 * property ordering, which is insertion order for non-integer keys
 * (which is our case).
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */

import fs from 'node:fs';
import path from 'node:path';
import { platform } from 'node:os';
import { fileURLToPath } from 'node:url';

import compareFeatures from './compare-features.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

function orderFeatures(key, value) {
  if (value instanceof Object && '__compat' in value) {
    value = Object.keys(value)
      .sort(compareFeatures)
      .reduce((result, key) => {
        result[key] = value[key];
        return result;
      }, {});
  }
  return value;
}

/**
 * @param {string} filename
 */
const fixFeatureOrder = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, orderFeatures), null, 2);

  if (IS_WINDOWS) {
    // prevent false positives from git.core.autocrlf on Windows
    actual = actual.replace(/\r/g, '');
    expected = expected.replace(/\r/g, '');
  }

  if (actual !== expected) {
    fs.writeFileSync(filename, expected + '\n', 'utf-8');
  }
};

const self = fileURLToPath(import.meta.url);
if (process.argv[1] === self) {
  /**
   * @param {string[]} files
   */
  function load(...files) {
    for (let file of files) {
      if (file.indexOf(dirname) !== 0) {
        file = path.resolve(dirname, '..', file);
      }

      if (!fs.existsSync(file)) {
        continue; // Ignore non-existent files
      }

      if (fs.statSync(file).isFile()) {
        if (path.extname(file) === '.json') {
          fixFeatureOrder(file);
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

export default fixFeatureOrder;
