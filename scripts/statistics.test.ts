/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import getStats from './statistics.js';

describe('getStats', () => {
  let bcd: any;

  beforeEach(() => {
    bcd = {
      browsers: {
        chrome: {},
        firefox: {},
        safari: {},
      },
      webextensions: {
        feature1: {
          __compat: {
            support: {
              chrome: { version_added: '≤1' },
              firefox: { version_added: '4' },
              safari: { version_added: '10' },
            },
          },
        },
      },
      api: {
        feature2: {
          __compat: {
            support: {
              chrome: { version_added: '1' },
              firefox: { version_added: '≤30' },
              safari: { version_added: '1' },
            },
          },
        },
      },
    };
  });

  it('should return stats for all browsers when allBrowsers is true', () => {
    const stats = getStats('api', true, bcd);
    assert.deepEqual(stats, {
      total: { all: 3, range: 1, real: 2 },
      chrome: { all: 1, range: 0, real: 1 },
      firefox: { all: 1, range: 1, real: 0 },
      safari: { all: 1, range: 0, real: 1 },
    });
  });

  it('should return stats for webextensions browsers when folder is "webextensions"', () => {
    const stats = getStats('webextensions', false, bcd);
    assert.deepEqual(stats, {
      total: { all: 7, range: 1, real: 6 },
      chrome: { all: 1, range: 1, real: 0 },
      edge: { all: 1, range: 0, real: 1 },
      firefox: { all: 1, range: 0, real: 1 },
      opera: { all: 1, range: 0, real: 1 },
      safari: { all: 1, range: 0, real: 1 },
      firefox_android: { all: 1, range: 0, real: 1 },
      safari_ios: { all: 1, range: 0, real: 1 },
    });
  });

  it('should return null when folder does not exist', () => {
    const stats = getStats('nonexistent', false, bcd);
    assert.equal(stats, null);
  });
});
