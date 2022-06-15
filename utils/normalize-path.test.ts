/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { normalizePathInternal } from './normalize-path.js';

describe('normalizePath()', function () {
  const pathWindows = {
    sep: '\\',
  };

  const pathPOSIX = {
    sep: '/',
  };

  describe('On Windows should replace "\\" with "/"', function () {
    assert.equal(normalizePathInternal('\\', pathWindows), '/');
    assert.equal(normalizePathInternal('\\a\\b', pathWindows), '/a/b');
    assert.equal(normalizePathInternal('a\\b', pathWindows), 'a/b');
  });

  describe('should do nothing with anything else', function () {
    assert.equal(normalizePathInternal('/', pathPOSIX), '/');
    assert.equal(normalizePathInternal('/a-b', pathPOSIX), '/a-b');
    assert.equal(normalizePathInternal('ab', pathPOSIX), 'ab');
  });
});
