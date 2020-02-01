'use strict';
const fs = require('fs');
const path = require('path');
const extend = require('extend');

/**
 * Recursively load one or more files and/or directories passed as arguments.
 *
 * @returns {object} All of the browser compatibility data
 */
function load() {
  let dir,
    result = {};

  /**
   * Process data from a file based upon the filename. If the given filename is a directory, recursively load it.
   *
   * @param {string} fn Filename to process
   * @returns {void}
   */
  function processFilename(fn) {
    const fp = path.join(dir, fn);
    let extra;

    if (fs.statSync(fp).isDirectory()) {
      extra = load(fp);
    } else if (path.extname(fp) === '.json') {
      try {
        extra = require(fp);
      } catch (e) {}
    }

    // The JSON data is independent of the actual file
    // hierarchy, so it is essential to extend "deeply".
    result = extend(true, result, extra);
  }

  for (dir of arguments) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(processFilename);
  }

  return result;
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
  'xpath',
  'xslt',
);
