/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

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

describe('ConsistencyChecker.checkParentRangeContainment()', () => {
  /**
   * Wrap support statements in a compat statement.
   * @param {object} support The support block
   * @returns {object} The compat statement
   */
  const compat = (support) => ({ support });

  it('flags a child in "preview" under a parent whose canonical support was removed', () => {
    // The issue's own example (css.properties.line-clamp).
    const parent = compat({
      safari: [
        { prefix: '-webkit-', version_added: '5' },
        { version_added: '18.2', version_removed: '18.4' },
      ],
    });
    const child = compat({ safari: { version_added: 'preview' } });
    assert.deepEqual(
      check.checkParentRangeContainment(parent, child, 'safari'),
      {
        version_added: 'preview',
      },
    );
  });

  it('flags an unflagged child in "preview" under a flag-gated parent', () => {
    const parent = compat({
      safari: {
        version_added: 'preview',
        flags: [{ type: 'runtime_flag', name: 'useTemporal' }],
      },
    });
    const child = compat({ safari: { version_added: 'preview' } });
    assert.ok(check.checkParentRangeContainment(parent, child, 'safari'));
  });

  it('flags an ongoing child under a parent whose canonical support was removed', () => {
    const parent = compat({
      opera: { version_added: '10.6', version_removed: '15' },
    });
    const child = compat({ opera: { version_added: '16' } });
    assert.ok(check.checkParentRangeContainment(parent, child, 'opera'));
  });

  it('flags an unflagged child under a flag-gated parent', () => {
    const parent = compat({
      deno: {
        version_added: '2.2',
        flags: [{ type: 'runtime_flag', name: '--unstable-net' }],
      },
    });
    const child = compat({ deno: { version_added: '2.2' } });
    assert.ok(check.checkParentRangeContainment(parent, child, 'deno'));
  });

  it('resolves "mirror" before comparing', () => {
    const parent = compat({
      chrome: { version_added: '10', version_removed: '20' },
      edge: 'mirror',
    });
    const child = compat({
      chrome: { version_added: '25' },
      edge: 'mirror',
    });
    assert.ok(check.checkParentRangeContainment(parent, child, 'edge'));
  });

  it('does not flag when the parent is currently supported', () => {
    const parent = compat({ chrome: { version_added: '10' } });
    const child = compat({ chrome: { version_added: '12' } });
    assert.equal(
      check.checkParentRangeContainment(parent, child, 'chrome'),
      null,
    );
  });

  it('does not flag when the parent has no canonical support (only prefixed)', () => {
    const parent = compat({
      safari: { prefix: 'webkit', version_added: '6' },
    });
    const child = compat({ safari: { version_added: '14' } });
    assert.equal(
      check.checkParentRangeContainment(parent, child, 'safari'),
      null,
    );
  });

  it('does not flag when the parent lacks the browser entirely', () => {
    const parent = compat({ chrome: { version_added: '10' } });
    const child = compat({ firefox: { version_added: '12' } });
    assert.equal(
      check.checkParentRangeContainment(parent, child, 'firefox'),
      null,
    );
  });

  it('does not flag a prefixed or alternative-name child', () => {
    const parent = compat({
      chrome: { version_added: '10', version_removed: '20' },
    });
    assert.equal(
      check.checkParentRangeContainment(
        parent,
        compat({ chrome: { prefix: 'webkit', version_added: '25' } }),
        'chrome',
      ),
      null,
    );
    assert.equal(
      check.checkParentRangeContainment(
        parent,
        compat({ chrome: { alternative_name: 'legacy', version_added: '25' } }),
        'chrome',
      ),
      null,
    );
  });

  it('does not flag a flagged child under a flag-gated parent', () => {
    const parent = compat({
      chrome: {
        version_added: '10',
        flags: [{ type: 'preference', name: 'test' }],
      },
    });
    const child = compat({
      chrome: {
        version_added: '12',
        flags: [{ type: 'preference', name: 'test' }],
      },
    });
    assert.equal(
      check.checkParentRangeContainment(parent, child, 'chrome'),
      null,
    );
  });

  it('does not flag a child that is itself removed', () => {
    const parent = compat({
      chrome: { version_added: '10', version_removed: '20' },
    });
    const child = compat({
      chrome: { version_added: '12', version_removed: '18' },
    });
    assert.equal(
      check.checkParentRangeContainment(parent, child, 'chrome'),
      null,
    );
  });
});
