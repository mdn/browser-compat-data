import assert from 'node:assert/strict';

import { ConsistencyChecker } from './test-consistency.js';

const check = new ConsistencyChecker();

describe('ConsistencyChecker.getVersionAdded()', function () {
  it('returns null for non-real values', () => {
    assert.equal(check.getVersionAdded({ version_added: null }), null);
  });

  it('returns null for "preview" values', () => {
    assert.equal(check.getVersionAdded({ version_added: 'preview' }), null);
  });

  it('returns the value for real and ranged values', () => {
    assert.equal(check.getVersionAdded({ version_added: '12' }), '12');
    assert.equal(check.getVersionAdded({ version_added: '≤11' }), '≤11');
  });

  it('returns the earliest real value for an array support statement', () => {
    assert.equal(
      check.getVersionAdded([
        { version_added: '≤11' },
        { version_added: '101' },
      ]),
      '≤11',
    );
    assert.equal(
      check.getVersionAdded([
        { version_added: 'preview' },
        { version_added: '≤11', flags: [] },
      ]),
      null,
    );
    assert.equal(
      check.getVersionAdded([
        { version_added: true },
        { version_added: '≤11', flags: [] },
      ]),
      null,
    );
    assert.equal(
      check.getVersionAdded([
        { version_added: '87' },
        { version_added: true, flags: [] },
      ]),
      null,
    );
  });
});
