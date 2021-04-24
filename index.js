/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const extend = require('extend');

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
          extra = JSON.parse(fs.readFileSync(fp));
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
