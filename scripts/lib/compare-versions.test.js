/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import compareVersions from './compare-versions.js';

describe('compare-versions script', () => {
  it('`compareVersions` works correctly', () => {
    assert.equal(compareVersions('1', '1'), 0);
    assert.equal(compareVersions('1', '2'), -1);
    assert.equal(compareVersions('2', '1'), 1);
    assert.equal(compareVersions('1', '≤2'), -1);
    assert.equal(compareVersions('≤2', '1'), 1);
    assert.equal(compareVersions('2', '≤2'), 0);
    assert.equal(compareVersions('≤2', '2'), 0);
    assert.equal(compareVersions('≤2', '≤2'), 0);
    assert.equal(compareVersions('1', 'preview'), -1);
    assert.equal(compareVersions('preview', '1'), 1);
    assert.equal(compareVersions('preview', 'preview'), 0);
  });

  it('`compareVersions.validate` works correctly', () => {
    assert.equal(compareVersions.validate('1'), true);
    assert.equal(compareVersions.validate('2'), true);
    assert.equal(compareVersions.validate('preview'), true);
    assert.equal(compareVersions.validate('≤2'), true);
    assert.equal(compareVersions.validate('foo'), false);
    assert.equal(compareVersions.validate('≤preview'), true);
  });

  it('`compareVersions.compare` works correctly', () => {
    assert.equal(compareVersions.compare('1', 'preview', '<'), true);
    assert.equal(compareVersions.compare('≤2', 'preview', '<'), true);
  });
});
