/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

/** @import {BrowserStatement} from '../../types/types.js' */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';

import test from './test-browsers-data.js';

describe('test-browsers-data', () => {
  /** @type {Logger} */
  let logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should log an error if a browser has multiple current releases', () => {
    const browser = 'nodejs';
    /** @type {BrowserStatement} */
    const data = {
      name: 'Node.js',
      type: 'server',
      accepts_flags: true,
      accepts_webextensions: false,
      releases: {
        '20.6.0': {
          release_date: '2023-09-04',
          status: 'current',
        },
        '21.2.0': {
          release_date: '2023-11-14',
          status: 'current',
        },
      },
    };

    test.check(logger, { data, path: { full: 'nodejs', browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a browser has multiple nightly releases', () => {
    const browser = 'firefox';
    /** @type {BrowserStatement} */
    const data = {
      name: 'Firefox',
      type: 'desktop',
      accepts_flags: true,
      accepts_webextensions: true,
      releases: {
        1: { status: 'nightly' },
        2: { status: 'nightly' },
      },
    };
    test.check(logger, { data, path: { full: 'firefox', browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should not log an error if a server engine has multiple nightly releases', () => {
    const browser = 'nodejs';
    /** @type {BrowserStatement} */
    const data = {
      name: 'Node.js',
      type: 'server',
      accepts_flags: true,
      accepts_webextensions: false,
      releases: {
        1: { status: 'nightly' },
        2: { status: 'nightly' },
      },
    };
    test.check(logger, { data, path: { full: 'nodejs', browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if the upstream for a browser is set to itself', () => {
    const browser = 'safari_ios';
    /** @type {BrowserStatement} */
    const data = {
      name: 'Safari iOS',
      type: 'mobile',
      upstream: browser,
      accepts_flags: false,
      accepts_webextensions: false,
      releases: {},
    };

    test.check(logger, { data, path: { full: 'safari_ios', browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if the upstream for a browser is an unknown browser', () => {
    const browser = 'safari_ios';
    /** @type {BrowserStatement} */
    const data = {
      name: 'Safari iOS',
      type: 'mobile',
      upstream: /** @type {*} */ ('unknown'),
      accepts_flags: false,
      accepts_webextensions: false,
      releases: {},
    };

    test.check(logger, { data, path: { full: 'safari_ios', browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a retired or current release has no release date', () => {
    const browser = 'opera';
    /** @type {BrowserStatement} */
    const data = {
      name: 'Opera',
      type: 'desktop',
      upstream: 'chrome',
      pref_url: 'opera://flags',
      accepts_flags: true,
      accepts_webextensions: true,
      releases: {
        97: {
          status: 'retired',
          engine: 'Blink',
          engine_version: '111',
        },
        98: {
          status: 'current',
          engine: 'Blink',
          engine_version: '112',
        },
      },
    };
    test.check(logger, { data, path: { full: 'opera', browser } });
    assert.equal(logger.messages.length, 2);
  });
});
