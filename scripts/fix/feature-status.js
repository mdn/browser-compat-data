/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

'use strict';

const fs = require('fs');
const path = require('path');
const { platform } = require('os');

const { IS_WINDOWS } = require('../../test/utils.js');

/**
 * Return a new feature object whose status properties have been adjusted according to a few predefined rules.
 *
 * @param {string} key The key in the object
 * @param {*} value The value of the key
 *
 * @returns {*} The new value
 */
const fixStatus = (key, value) => {
  const compat = value?.__compat;
  if (compat) {
    if (compat.spec_url && compat.status.standard_track === false) {
      compat.status.standard_track = true;
    }
    if (compat.status.experimental) {
      const browserSupport = new Set();

      for (const [browser, support] of Object.entries(compat.support)) {
        // Consider only the first part of an array statement.
        const statement = Array.isArray(support) ? support[0] : support;
        // Ignore anything behind flag, prefix or alternative name
        if (statement.flags || statement.prefix || statement.alternative_name) {
          continue;
        }
        if (statement.version_added && !statement.version_removed) {
          browserSupport.add(browser);
        }
      }

      // Now check which of Blink, Gecko and WebKit support it.

      const engineSupport = new Set();

      for (const browser of browserSupport) {
        const currentRelease = Object.values(browsers[browser].releases).find(
          (r) => r.status === 'current',
        );
        const engine = currentRelease.engine;
        engineSupport.add(engine);
      }

      let engineCount = 0;
      for (const engine of ['Blink', 'Gecko', 'WebKit']) {
        if (engineSupport.has(engine)) {
          engineCount++;
        }
      }

      if (engineCount > 1) {
        compat.status.experimental = false;
      }
    }
  }

  return value;
};

/**
 * @param {string} filename
 */
const fixStatusFromFile = (filename) => {
  let actual = fs.readFileSync(filename, 'utf-8').trim();
  let expected = JSON.stringify(JSON.parse(actual, fixStatus), null, 2);

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
          fixStatusFromFile(file);
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

module.exports = fixStatusFromFile;
