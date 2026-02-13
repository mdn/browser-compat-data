/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ConsistencyChecker } from './test-consistency.js';

const check = new ConsistencyChecker();

describe('ConsistencyChecker.getVersionAdded()', () => {
  it('returns false for "preview" values', () => {
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: 'preview' } }, 'chrome'),
      false,
    );
  });

  it('returns the value for exact and ranged values', () => {
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: '12' } }, 'chrome'),
      '12',
    );
    assert.equal(
      check.getVersionAdded({ chrome: { version_added: '≤11' } }, 'chrome'),
      '≤11',
    );
  });

  it('returns the earliest value for an array support statement', () => {
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
            {
              version_added: '≤11',
              flags: [{ type: 'preference', name: 'test' }],
            },
          ],
        },
        'chrome',
      ),
      false,
    );
    assert.equal(
      check.getVersionAdded(
        {
          chrome: [
            { version_added: '20' },
            {
              version_added: '≤11',
              flags: [{ type: 'preference', name: 'test' }],
            },
          ],
        },
        'chrome',
      ),
      '20',
    );
    assert.equal(
      check.getVersionAdded(
        {
          chrome: [
            { version_added: '87' },
            {
              version_added: '1',
              flags: [{ type: 'preference', name: 'test' }],
            },
          ],
        },
        'chrome',
      ),
      '87',
    );
  });
});
