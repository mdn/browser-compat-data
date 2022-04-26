#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import fs from 'node:fs';
import path from 'node:path';
import { platform } from 'node:os';
import { fileURLToPath } from 'node:url';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/** Determines if the OS is Windows */
const IS_WINDOWS = platform() === 'win32';

const removeWebViewFlags = (key, value) => {
  if (key === '__compat') {
    if (value.support.webview_android !== undefined) {
      if (Array.isArray(value.support.webview_android)) {
        const result = [];
        for (let i = 0; i < value.support.webview_android.length; i++) {
          if (value.support.webview_android[i].flags === undefined) {
            result.push(value.support.webview_android[i]);
          }
        }

        if (result.length == 0) {
          value.support.webview_android = { version_added: false };
        } else if (result.length == 1) {
          value.support.webview_android = result[0];
        } else {
          value.support.webview_android = result;
        }
      } else if (value.support.webview_android.flags !== undefined) {
        value.support.webview_android = { version_added: false };
      }
    }
  }
  return value;
};

/**
 * @param {string} filename
 */
const fixWebViewFlags = (filename) => {
  const actual = fs.readFileSync(filename, 'utf-8').trim();
  const expected = JSON.stringify(
    JSON.parse(actual, removeWebViewFlags),
    null,
    2,
  );

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
        file = path.resolve(dirname, '..', '..', file);
      }

      if (!fs.existsSync(file)) {
        continue; // Ignore non-existent files
      }

      if (fs.statSync(file).isFile()) {
        if (path.extname(file) === '.json') {
          fixWebViewFlags(file);
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

export { fixWebViewFlags, removeWebViewFlags };
