/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { addedBeforeRemoved } from './test-versions.js';

describe('addedBeforeRemoved', function () {
  it('values are simple version numbers', () => {
    assert.equal(
      addedBeforeRemoved({ version_added: '1', version_removed: '1' }),
      false,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: '1', version_removed: '2' }),
      true,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: '2', version_removed: '1' }),
      false,
    );
  });

  it('values include inequalities', () => {
    assert.equal(
      addedBeforeRemoved({ version_added: '1', version_removed: '≤2' }),
      true,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: '≤2', version_removed: '1' }),
      false,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: '2', version_removed: '≤2' }),
      false,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: '≤2', version_removed: '2' }),
      false,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: '≤2', version_removed: '≤2' }),
      false,
    );
  });

  it('values include preview', () => {
    assert.equal(
      addedBeforeRemoved({ version_added: '1', version_removed: 'preview' }),
      null,
    );
    assert.equal(
      addedBeforeRemoved({ version_added: 'preview', version_removed: '1' }),
      null,
    );
    assert.equal(
      addedBeforeRemoved({
        version_added: 'preview',
        version_removed: 'preview',
      }),
      null,
    );
  });
});
