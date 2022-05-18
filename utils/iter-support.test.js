/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { strict as assert } from 'node:assert';

import iterSupport from './iter-support.js';

describe('iterSupport()', function () {
  it('returns a `"version_added": null` support statement for non-existent browsers', function () {
    assert.deepEqual(iterSupport({ support: { firefox: [] } }, 'chrome'), [
      { version_added: null },
    ]);
  });

  it('returns a single support statement as an array', function () {
    assert.deepEqual(
      iterSupport({ support: { firefox: { version_added: true } } }, 'firefox'),
      [{ version_added: true }],
    );
  });

  it('returns an array of support statements as an array', function () {
    const compatObj = {
      support: { firefox: [{ version_added: true }, { version_added: '1' }] },
    };
    const support = [{ version_added: true }, { version_added: '1' }];

    assert.deepEqual(iterSupport(compatObj, 'firefox'), support);
  });
});
