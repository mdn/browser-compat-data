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
