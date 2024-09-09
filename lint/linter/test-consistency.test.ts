/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { ConsistencyChecker } from './test-consistency.js';

const check = new ConsistencyChecker();

describe('ConsistencyChecker.getVersionAdded()', () => {
  it('returns null for non-real values', () => {
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: null } }, 'chrome'),
      null,
    );
  });

  it('returns null for "preview" values', () => {
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: 'preview' } }, 'chrome'),
      null,
    );
  });

  it('returns the value for real and ranged values', () => {
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: '12' } }, 'chrome'),
      '12',
    );
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: '≤11' } }, 'chrome'),
      '≤11',
    );
  });

  it('returns the earliest real value for an array support statement', () => {
    assert.equal(
      check.getVersionAdded(
        { chrome: [{ version_added: '≤11' }, { version_added: '101' }] },
        'chrome',
      ),
      '≤11',
    );
    assert.equal(
      check.getVersionAdded(
        {
          chrome: [
            { version_added: 'preview' },
            { version_added: '≤11', flags: [] },
          ],
        },
        'chrome',
      ),
      null,
    );
    assert.equal(
      check.getVersionAdded(
        {
          chrome: [
            { version_added: true },
            { version_added: '≤11', flags: [] },
          ],
        },
        'chrome',
      ),
      null,
    );
    assert.equal(
      check.getVersionAdded(
        {
          chrome: [{ version_added: '87' }, { version_added: true, flags: [] }],
        },
        'chrome',
      ),
      '87',
    );
  });
});
