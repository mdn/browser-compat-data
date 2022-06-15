/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { neverImplemented } from './test-obsolete.js';

describe('neverImplemented', function () {
  it('returns false for features which were implemented', () => {
    assert.equal(
      neverImplemented({
        chrome: { version_added: '1' },
      }),
      false,
    );
    assert.equal(
      neverImplemented({
        chrome: { version_added: '1', prefix: 'webkit' },
      }),
      false,
    );
    assert.equal(
      neverImplemented({
        chrome: [
          { version_added: '1', version_removed: '15' },
          { version_added: '17' },
        ],
      }),
      false,
    );
  });

  it('returns true for features which were not implemented', () => {
    assert.equal(
      neverImplemented({
        chrome: { version_added: null },
      }),
      true,
    );
    assert.equal(
      neverImplemented({
        chrome: { version_added: false },
      }),
      true,
    );
  });
});
