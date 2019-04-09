'use strict';
const fs = require('fs');
const path = require('path');
const extend = require('extend');

/**
 * Recursively load one or more directories passed as arguments.
 *
 * @param {string|string[]} files
 * @returns {import('./types').CompatData}
 */
exports.load = function load(files) {
  /** @type {string} */
  let dir;
  /** @type {any} */
  let result = {};

  function processFilename(fn) {
    const fp = path.join(dir, fn);
    let extra;

    // If the given filename is a directory, recursively load it.
    if (fs.statSync(fp).isDirectory()) {
      extra = load(fp);
    } else if (path.extname(fp) === '.json') {
      extra = require(fp);
    }

    // The JSON data is independent of the actual file
    // hierarchy, so it is essential to extend "deeply".
    result = extend(true, result, extra);
  }

  if (typeof files === "string") {
    files = arguments;
  }

  for (dir of files) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(processFilename);
  }

  return result;
}
