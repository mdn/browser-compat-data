'use strict';
const assert = require('assert').strict;
const {
  compareRangedVersions,
  isVersionInRange,
  isSupported,
} = require('./query2.js');

describe('query', () => {
  it('compareRangedVersions', () => {
    assert.equal(compareRangedVersions('1', '1'), 0);
    assert.equal(compareRangedVersions('1', '2'), -1);
    assert.equal(compareRangedVersions('2', '1'), 1);

    assert.equal(compareRangedVersions('≤1', '1'), 0);
    assert.equal(compareRangedVersions('≤1', '2'), -1);
    assert.equal(compareRangedVersions('≤2', '1'), NaN);

    assert.equal(compareRangedVersions('1', '≤1'), 0);
    assert.equal(compareRangedVersions('1', '≤2'), NaN);
    assert.equal(compareRangedVersions('2', '≤1'), 1);

    assert.equal(compareRangedVersions('≤1', '≤1'), NaN);
    assert.equal(compareRangedVersions('≤1', '≤2'), NaN);
    assert.equal(compareRangedVersions('≤2', '≤1'), NaN);
  });

  describe('isVersionInRange', () => {
    it('added true/false/null', () => {
      assert.equal(isVersionInRange('10', { version_added: true }), null);
      assert.equal(isVersionInRange('10', { version_added: false }), false);
      assert.equal(isVersionInRange('10', { version_added: null }), null);
    });

    it('added specific version', () => {
      assert.equal(isVersionInRange('1', { version_added: '2' }), false);
      assert.equal(isVersionInRange('2', { version_added: '2' }), true);
      assert.equal(isVersionInRange('3', { version_added: '2' }), true);
    });

    it('added version range', () => {
      assert.equal(isVersionInRange('1', { version_added: '≤2' }), null);
      assert.equal(isVersionInRange('2', { version_added: '≤2' }), true);
      assert.equal(isVersionInRange('3', { version_added: '≤2' }), true);
    });

    it('added and removed at specific versions', () => {
      assert.equal(
        isVersionInRange('1', { version_added: '2', version_removed: '3' }),
        false,
      );
      assert.equal(
        isVersionInRange('2', { version_added: '2', version_removed: '3' }),
        true,
      );
      assert.equal(
        isVersionInRange('3', { version_added: '2', version_removed: '3' }),
        false,
      );
    });

    it('added and removed with range versions', () => {
      assert.equal(
        isVersionInRange('1', { version_added: '≤2', version_removed: '3' }),
        null,
      );
      assert.equal(
        isVersionInRange('2', { version_added: '≤2', version_removed: '3' }),
        true,
      );
      assert.equal(
        isVersionInRange('3', { version_added: '≤2', version_removed: '3' }),
        false,
      );

      assert.equal(
        isVersionInRange('1', { version_added: '2', version_removed: '≤3' }),
        false,
      );
      assert.equal(
        isVersionInRange('2', { version_added: '2', version_removed: '≤3' }),
        true,
      );
      assert.equal(
        isVersionInRange('3', { version_added: '2', version_removed: '≤3' }),
        false,
      );

      assert.equal(
        isVersionInRange('1', { version_added: '≤2', version_removed: '≤3' }),
        null,
      );
      assert.equal(
        isVersionInRange('2', { version_added: '≤2', version_removed: '≤3' }),
        true,
      );
      assert.equal(
        isVersionInRange('3', { version_added: '≤2', version_removed: '≤3' }),
        false,
      );
    });

    it('added and removed with true/null versions', () => {
      assert.equal(
        isVersionInRange('2', { version_added: true, version_removed: true }),
        null,
      );
      assert.equal(
        isVersionInRange('2', { version_added: true, version_removed: '3' }),
        null,
      );
      assert.equal(
        isVersionInRange('3', { version_added: true, version_removed: '3' }),
        false,
      );
      assert.equal(
        isVersionInRange('4', { version_added: true, version_removed: '3' }),
        false,
      );

      assert.equal(
        isVersionInRange('2', { version_added: null, version_removed: true }),
        null,
      );
      assert.equal(
        isVersionInRange('2', { version_added: null, version_removed: '3' }),
        null,
      );
      assert.equal(
        isVersionInRange('3', { version_added: null, version_removed: '3' }),
        false,
      );
      assert.equal(
        isVersionInRange('4', { version_added: null, version_removed: '3' }),
        false,
      );
    });
  });

  describe('isSupported', () => {
    const support = {
      chrome: { version_added: true },
      edge: { version_added: false },
      firefox: { version_added: null },
      opera: { version_added: '11.5' },
      safari: { version_added: '4' },
    };

    it('no entry for browser', () => {
      assert.equal(isSupported(support, 'chrome_android', '1'), null);
    });

    it('version_added: true', () => {
      assert.equal(isSupported(support, 'chrome', '1'), null);
    });

    it('version_added: false', () => {
      assert.equal(isSupported(support, 'edge', '1'), false);
    });

    it('version_added: null', () => {
      assert.equal(isSupported(support, 'firefox', '1'), null);
    });

    it('version_added: real value (string)', () => {
      assert.equal(isSupported(support, 'opera', '11'), false);
      assert.equal(isSupported(support, 'opera', '11.1'), false);
      assert.equal(isSupported(support, 'opera', '11.5'), true);
      assert.equal(isSupported(support, 'opera', '11.6'), true);
      assert.equal(isSupported(support, 'opera', '12'), true);
    });
  });
});
