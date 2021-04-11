'use strict';
const fs = require('fs');
const path = require('path');

function load() {
  // Recursively load one or more directories passed as arguments.
  let dir,
    result = {};

  function processFilename(fn) {
    const fp = path.join(dir, fn);
    let extra;

    // If the given filename is a directory, recursively load it.
    if (fs.statSync(fp).isDirectory()) {
      extra = load(fp);
    } else if (path.extname(fp) === '.json') {
      try {
        extra = require(fp);
      } catch (e) {}
    }

    // The JSON data is independent of the actual file
    // hierarchy, so it is essential to extend "deeply".
    result = extend(result, extra);
  }

  for (dir of arguments) {
    dir = path.resolve(__dirname, dir);
    fs.readdirSync(dir).forEach(processFilename);
  }

  return result;
}

function extend(a, b) {
  // iterate over all direct and inherited enumerable properties
  for (const name in b) {
    let newValue = b[name];

    // check if the new value is an object and its property exists on the former
    if (typeof newValue === 'object' && newValue !== null && name in a) {
      const oldValue = a[name];

      // check if the former value is also an object
      if (typeof oldValue === 'object' && oldValue !== null) {
        // update the new value as a new object extended by the former and later
        newValue = extend(extend({}, oldValue), newValue);
      }
    }

    // update the object with the new value
    a[name] = newValue;
  }

  return a;
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
