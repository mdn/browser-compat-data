/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/**
 * @import { BrowserName, InternalSupportBlock, InternalSupportStatement } from '../../types/index.js'
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import mirrorSupport, { isOSLimitation, updateNotes } from './mirror.js';

/**
 * Build synthetic release records for the browser catalog.
 * @param {string[]} versions Browser release version keys.
 * @param {string} engine Engine name associated with each release.
 * @param {string[]} [engineVersions] Engine release versions.
 * @returns {Record<string, { engine: string, engine_version: string }>} Synthetic release records.
 */
const releases = (versions, engine, engineVersions = versions) =>
  Object.fromEntries(
    versions.map((version, index) => [
      version,
      { engine, engine_version: engineVersions[index] },
    ]),
  );

/** @type {*} */
const browsers = {
  chrome: {
    name: 'Chrome',
    type: 'desktop',
    releases: {
      ...releases(['10', '24', '28'], 'WebKit', ['10', '24', '28']),
      ...releases(
        [
          '29',
          '30',
          '35',
          '38',
          '40',
          '50',
          '65',
          '70',
          '73',
          '80',
          '90',
          '134',
        ],
        'Blink',
      ),
    },
  },
  chrome_android: {
    name: 'Chrome for Android',
    type: 'mobile',
    upstream: 'chrome',
    releases: releases(
      [
        '26',
        '27',
        '29',
        '30',
        '35',
        '38',
        '40',
        '50',
        '65',
        '70',
        '73',
        '80',
        '90',
        '134',
      ],
      'Blink',
    ),
  },
  edge: {
    name: 'Microsoft Edge',
    type: 'desktop',
    upstream: 'chrome',
    releases: releases(['79', '80', '90'], 'Blink'),
  },
  firefox: {
    name: 'Firefox',
    type: 'desktop',
    releases: releases(['70', '72', '73'], 'Gecko'),
  },
  firefox_android: {
    name: 'Firefox for Android',
    type: 'mobile',
    upstream: 'firefox',
    releases: releases(['79', '80'], 'Gecko', ['72', '73']),
  },
  opera: {
    name: 'Opera',
    type: 'desktop',
    upstream: 'chrome',
    preview_name: 'Developer',
    releases: releases(['15', '16', '17', '52', '57', '76'], 'Blink', [
      '28',
      '29',
      '30',
      '65',
      '70',
      '90',
    ]),
  },
  opera_android: {
    name: 'Opera Android',
    type: 'mobile',
    upstream: 'chrome_android',
    releases: releases(['14', '15', '16', '18', '27'], 'Blink', [
      '26',
      '27',
      '29',
      '30',
      '40',
    ]),
  },
  safari: {
    name: 'Safari',
    type: 'desktop',
    releases: releases(['15', '15.4'], 'WebKit'),
  },
  safari_ios: {
    name: 'Safari on iOS',
    type: 'mobile',
    upstream: 'safari',
    releases: releases(
      [
        '1',
        '2',
        '3',
        '3.2',
        '4.2',
        '5',
        '9.3',
        '10.3',
        '11.3',
        '12.2',
        '13.4',
        '14.5',
        '15',
        '15.4',
      ],
      'WebKit',
    ),
  },
  samsunginternet_android: {
    name: 'Samsung Internet',
    type: 'mobile',
    upstream: 'chrome_android',
    accepts_flags: false,
    releases: releases(['15.0'], 'Blink', ['90']),
  },
};

/**
 * Mirror support data using the synthetic browser catalog.
 * @param {BrowserName} destination Destination browser.
 * @param {InternalSupportBlock} support Support data by browser.
 * @returns {InternalSupportStatement} Mirrored support data.
 */
const mirror = (destination, support) =>
  mirrorSupport(destination, support, browsers);

describe('mirror', () => {
  describe('isOSLimitation', () => {
    it('returns true for OS limitation notes', () => {
      assert.equal(
        isOSLimitation('Supported on ChromeOS, macOS, and Windows only.'),
        true,
      );
      assert.equal(isOSLimitation('Supported on macOS only.'), true);
      assert.equal(isOSLimitation('Not supported on Windows.'), true);
    });

    it('returns false for ordinary notes and empty strings', () => {
      assert.equal(isOSLimitation('This feature requires a flag.'), false);
      assert.equal(isOSLimitation(''), false);
    });
  });

  describe('version mapping', () => {
    const cases = [
      { browser: 'opera', source: '28', expected: '15' },
      { browser: 'opera', source: '29', expected: '16' },
      { browser: 'opera', source: '65', expected: '52' },
      { browser: 'edge', source: '80', expected: '80' },
      { browser: 'firefox_android', source: '70', expected: '79' },
      { browser: 'safari_ios', source: '9.1', expected: '9.3' },
      { browser: 'safari_ios', source: '15.4', expected: '15.4' },
      { browser: 'safari_ios', source: '≤9.1', expected: '≤9.3' },
    ];

    for (const { browser, source, expected } of cases) {
      it(`${browser} maps ${source} to ${expected}`, () => {
        const upstream = browsers[browser].upstream;
        const mirrored = mirror(/** @type {BrowserName} */ (browser), {
          [upstream]: { version_added: source },
        });
        assert.deepEqual(mirrored, { version_added: expected });
      });
    }

    it('maps preview only when the destination has a preview release', () => {
      assert.deepEqual(
        mirror('opera', { chrome: { version_added: 'preview' } }),
        { version_added: 'preview' },
      );
      assert.deepEqual(
        mirror('edge', { chrome: { version_added: 'preview' } }),
        { version_added: false },
      );
    });
  });

  describe('updateNotes', () => {
    /**
     * Version mapper used by updateNotes tests.
     * @type {(string) => (string | false)}
     */
    const versionMapper = (version) =>
      version === '99' ? false : String(Number(version) + 1);
    const regex = /\bChrome\b/g;

    it('updates browser names and mapped versions', () => {
      assert.equal(
        updateNotes(
          'Supported since Chrome 70.',
          regex,
          'Opera',
          versionMapper,
        ),
        'Supported since Opera 71.',
      );
    });

    it('filters unmapped version notes while keeping other notes', () => {
      assert.equal(
        updateNotes(
          ['Supported on ChromeOS.', 'Supported since Chrome 99.'],
          regex,
          'Opera',
          versionMapper,
        ),
        'Supported on ChromeOS.',
      );
    });

    it('maps generic version references', () => {
      assert.equal(
        updateNotes(
          'Supported since version 70.',
          regex,
          'Opera',
          versionMapper,
        ),
        'Supported since version 71.',
      );
    });

    it('returns null when every array note has an unmapped version', () => {
      assert.equal(
        updateNotes(
          ['Supported since Chrome 99.', 'Available since Chrome 99.'],
          regex,
          'Opera',
          versionMapper,
        ),
        null,
      );
    });
  });

  describe('notes and special support data', () => {
    it('does not rename ChromeOS when replacing browser names', () => {
      assert.deepEqual(
        mirror('opera', {
          chrome: {
            version_added: '65',
            notes: 'This feature is only supported in ChromeOS.',
          },
        }),
        {
          version_added: '52',
          notes: 'This feature is only supported in ChromeOS.',
        },
      );
    });

    it('maps version references and browser names in notes', () => {
      /** @type {InternalSupportBlock} */
      const support = {
        chrome: {
          version_added: '65',
          notes: [
            'Supported since version 70.',
            'Google Chrome 70 added support.',
          ],
        },
      };
      assert.deepEqual(mirror('opera', support), {
        version_added: '52',
        notes: ['Supported since version 57.', 'Opera 57 added support.'],
      });
    });

    it('drops OS-specific partial support when mirroring to mobile', () => {
      /** @type {InternalSupportBlock} */
      const support = {
        chrome: {
          version_added: '70',
          partial_implementation: true,
          notes: 'Supported on ChromeOS, macOS, and Windows only.',
        },
      };
      assert.deepEqual(mirror('chrome_android', support), {
        version_added: '70',
      });
    });

    it('preserves non-OS-specific partial support', () => {
      /** @type {InternalSupportBlock} */
      const support = {
        chrome: {
          version_added: '70',
          partial_implementation: true,
          notes: 'This feature is incomplete.',
        },
      };
      assert.deepEqual(mirror('chrome_android', support), {
        version_added: '70',
        partial_implementation: true,
        notes: 'This feature is incomplete.',
      });
    });

    it('drops flags unsupported by the destination', () => {
      /** @type {InternalSupportBlock} */
      const support = {
        chrome_android: {
          version_added: '50',
          flags: [{ name: 'feature', type: 'preference' }],
        },
      };
      assert.deepEqual(mirror('samsunginternet_android', support), {
        version_added: false,
      });
    });

    it('filters unsupported flagged entries from mixed support arrays', () => {
      /** @type {InternalSupportBlock} */
      const support = {
        chrome_android: [
          {
            version_added: '90',
          },
          {
            version_added: '50',
            flags: [{ name: 'feature', type: 'preference' }],
          },
        ],
      };
      assert.deepEqual(mirror('samsunginternet_android', support), {
        version_added: '15.0',
      });
    });

    it('resolves chained mirror statements', () => {
      /** @type {InternalSupportBlock} */
      const support = {
        chrome: { version_added: '40' },
        chrome_android: 'mirror',
      };
      assert.deepEqual(mirror('opera_android', support), {
        version_added: '27',
      });
    });
  });

  describe('edge cases', () => {
    it('returns false when added and removed versions map to the same release', () => {
      assert.deepEqual(
        mirror('firefox_android', {
          firefox: { version_added: '70', version_removed: '72' },
        }),
        { version_added: false },
      );
    });

    it('returns false for a feature removed before Chromium Edge', () => {
      assert.deepEqual(
        mirror('edge', {
          chrome: {
            version_added: '10',
            version_removed: '24',
            prefix: 'webkit',
          },
        }),
        { version_added: false },
      );
    });

    it('preserves matching ranges and maps ranges before the first downstream release', () => {
      assert.deepEqual(mirror('edge', { chrome: { version_added: '≤80' } }), {
        version_added: '≤80',
      });
      assert.deepEqual(mirror('edge', { chrome: { version_added: '≤24' } }), {
        version_added: '79',
      });
    });

    it('updates browser names in link fragments', () => {
      assert.deepEqual(
        mirror('chrome_android', {
          chrome: {
            version_added: '35',
            notes: '[Chrome](https://example.com/#exceptions_in_Chrome)',
          },
        }),
        {
          version_added: '35',
          notes:
            '[Chrome for Android](https://example.com/#exceptions_in_Chrome)',
        },
      );
    });

    it('validates the target and upstream data', () => {
      assert.throws(
        () => mirror(/** @type {BrowserName} */ ('chrome'), {}),
        /Upstream is not defined for chrome/,
      );
      assert.throws(
        () => mirror('chrome_android', {}),
        /The data for chrome is not defined/,
      );
    });
  });
});
