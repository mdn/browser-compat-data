#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { platform } = require('os');

const { removeWebViewFlags } = require('./002-remove-webview-flags.js');

const input = JSON.stringify({
  "test": {
    "__compat": {
      "support": {
        "webview_android": {
          "version_added": "61",
          "flags": [
            {
              "type": "preference",
              "name": "#service-worker-payment-apps",
              "value_to_set": "Enabled"
            }
          ]
        }
      },
      "status": {
        "experimental": true,
        "standard_track": false,
        "deprecated": false
      }
    }
  }
}, null, 2);

const expected = JSON.stringify({
  "test": {
    "__compat": {
      "support": {
        "webview_android": {
          "version_added": false
        }
      },
      "status": {
        "experimental": true,
        "standard_track": false,
        "deprecated": false
      }
    }
  }
}, null, 2);

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

const testFixWebViewFlags = (logger = console) => {
  let output = JSON.stringify(JSON.parse(input, removeWebViewFlags), null, 2);

  if (IS_WINDOWS) { // prevent false positives from git.core.autocrlf on Windows
    output = output.replace(/\r/g, '');
  }

  if (output !== expected) {
    logger.error(chalk`WebView flags aren't removed properly!\n      Actual: {yellow ${output}}\n      Expected: {green ${expected}}`);
    return true;
  }
  return false;
}

if (require.main === module) {
  testFixWebViewFlags();
}

module.exports = testFixWebViewFlags;
