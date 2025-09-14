/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import iterSupport from './iter-support.js';

describe('iterSupport()', () => {
  it('returns a `"version_added": false` support statement for non-existent browsers', () => {
    assert.deepEqual(iterSupport({ support: { firefox: [] } }, 'chrome'), [
      { version_added: false },
    ]);
  });

  it('returns a single support statement as an array', () => {
    assert.deepEqual(
      iterSupport({ support: { firefox: { version_added: '1' } } }, 'firefox'),
      [{ version_added: '1' }],
    );
  });

  it('returns an array of support statements as an array', () => {
    const compatObj = {
      support: {
        firefox: [
          { version_added: '1' },
          { version_added: '2', prefix: '-moz-' },
        ],
      },
    };
    const support = [
      { version_added: '1' },
      { version_added: '2', prefix: '-moz-' },
    ];

    assert.deepEqual(iterSupport(compatObj, 'firefox'), support);
  });
});
