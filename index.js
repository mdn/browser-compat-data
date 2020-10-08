/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const extend = require('extend');

function warnPackageName() {
  if (!warnPackageName.emitted) {
    warnPackageName.emitted = true;
    process.emitWarning(
      'mdn-browser-compat-data is deprecated. Upgrade to @mdn/browser-compat-data. Learn more: https://github.com/mdn/browser-compat-data/blob/v1.1.0/UPGRADE-2.0.x.md',
      {
        type: 'DeprecationWarning',
      },
    );
  }
}

function warnNode8Deprecation() {
  if (!warnNode8Deprecation.emitted) {
    warnNode8Deprecation.emitted = true;
    if (process.version.split('.')[0] === 'v8') {
      process.emitWarning(
        'mdn-browser-compat-data: @mdn/browser-compat-data ends support for Node.js 8. Upgrade to Node.js 10 or later.',
        {
          type: 'DeprecationWarning',
        },
      );
    }
  }
}

warnPackageName();
warnNode8Deprecation();

/**
 * Recursively load one or more files and/or directories passed as arguments.
 *
 * @param {string[]} files The files to test
 * @returns {object} All of the browser compatibility data
 */
const load = (...files) => {
  let dir,
    result = {};

  for (dir of files) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(fn => {
      const fp = path.join(dir, fn);
      let extra;

      if (fs.statSync(fp).isDirectory()) {
        extra = load(fp);
      } else if (path.extname(fp) === '.json') {
        try {
          extra = require(fp);
        } catch (e) {
          console.error(`Error loading ${fp}: ${e}`);
        }
      }

      // The JSON data is independent of the actual file
      // hierarchy, so it is essential to extend "deeply".
      result = extend(true, result, extra);
    });
  }

  return result;
};

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
  'xpath',
  'xslt',
);
