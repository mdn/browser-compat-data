/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */

import assert from 'node:assert/strict';

import { Logger } from '../utils.js';
import { BrowserStatement } from '../../types/types.js';

import test from './test-browsers-data.js';

describe('test-browsers-data', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test', 'test');
  });

  it('should log an error if a browser has multiple current releases', () => {
    const browser = 'nodejs';
    const data: BrowserStatement = {
      name: 'Node.js',
      type: 'server',
      accepts_flags: true,
      accepts_webextensions: false,
      releases: [
        {
          version: '20.6.0',
          release_date: '2023-09-04',
          status: 'current',
        },
        {
          version: '21.2.0',
          release_date: '2023-11-14',
          status: 'current',
        },
      ],
    };

    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a browser has multiple nightly releases', () => {
    const browser = 'firefox';
    const data: BrowserStatement = {
      name: 'Firefox',
      type: 'desktop',
      accepts_flags: true,
      accepts_webextensions: true,
      releases: [
        { version: '1', status: 'nightly' },
        { version: '2', status: 'nightly' },
      ],
    };
    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should not log an error if a server engine has multiple nightly releases', () => {
    const browser = 'nodejs';
    const data: BrowserStatement = {
      name: 'Node.js',
      type: 'server',
      accepts_flags: true,
      accepts_webextensions: false,
      releases: [
        { version: '1', status: 'nightly' },
        { version: '2', status: 'nightly' },
      ],
    };
    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if the upstream for a browser is set to itself', () => {
    const browser = 'safari_ios';
    const data: BrowserStatement = {
      name: 'Safari iOS',
      type: 'mobile',
      upstream: browser,
      accepts_flags: false,
      accepts_webextensions: false,
      releases: [],
    };

    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if the upstream for a browser is an unknown browser', () => {
    const browser = 'safari_ios';
    const data: BrowserStatement = {
      name: 'Safari iOS',
      type: 'mobile',
      upstream: 'unknown' as any,
      accepts_flags: false,
      accepts_webextensions: false,
      releases: [],
    };

    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 1);
  });

  it('should log an error if a retired or current release has no release date', () => {
    const browser = 'opera';
    const data: BrowserStatement = {
      name: 'Opera',
      type: 'desktop',
      upstream: 'chrome',
      pref_url: 'opera://flags',
      accepts_flags: true,
      accepts_webextensions: true,
      releases: [
        {
          version: '97',
          status: 'retired',
          engine: 'Blink',
          engine_version: '111',
        },
        {
          version: '98',
          status: 'current',
          engine: 'Blink',
          engine_version: '112',
        },
      ],
    };
    test.check(logger, { data, path: { browser } });
    assert.equal(logger.messages.length, 2);
  });
});
