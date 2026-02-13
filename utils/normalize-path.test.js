/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizePathInternal } from './normalize-path.js';

describe('normalizePath()', () => {
  const pathWindows = {
    sep: '\\',
  };

  const pathPOSIX = {
    sep: '/',
  };

  it('should replace "\\" with "/" on Windows', () => {
    assert.equal(normalizePathInternal('\\', pathWindows), '/');
    assert.equal(normalizePathInternal('\\a\\b', pathWindows), '/a/b');
    assert.equal(normalizePathInternal('a\\b', pathWindows), 'a/b');
  });

  it('should do nothing with anything else', () => {
    assert.equal(normalizePathInternal('/', pathPOSIX), '/');
    assert.equal(normalizePathInternal('/a-b', pathPOSIX), '/a-b');
    assert.equal(normalizePathInternal('ab', pathPOSIX), 'ab');
  });
});
